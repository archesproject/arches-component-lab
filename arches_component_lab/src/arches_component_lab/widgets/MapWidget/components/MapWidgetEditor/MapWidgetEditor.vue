<script setup lang="ts">
import {
    computed,
    onMounted,
    onUnmounted,
    provide,
    ref,
    shallowRef,
    useTemplateRef,
    watch,
} from "vue";

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import geojsonExtent from "@mapbox/geojson-extent";
import maplibregl from "maplibre-gl";
import { useGettext } from "vue3-gettext";

import BasemapControls from "@/arches_component_lab/widgets/MapWidget/components/MapWidgetEditor/components/BasemapControls.vue";
import FeaturePopup from "@/arches_component_lab/widgets/MapWidget/components/MapWidgetEditor/components/FeaturePopup.vue";
import InteractionsDrawer from "@/arches_component_lab/widgets/MapWidget/components/MapWidgetEditor/components/InteractionsDrawer.vue";
import MapFilter from "@/arches_component_lab/widgets/MapWidget/components/MapWidgetEditor/components/MapFilter/MapFilter.vue";
import OverlayControls from "@/arches_component_lab/widgets/MapWidget/components/MapWidgetEditor/components/OverlayControls.vue";

import {
    fetchMapSettings,
    fetchMapData,
    fetchDrawnFeaturesBuffer,
    fetchGeoJSONBounds,
} from "@/arches_component_lab/widgets/MapWidget/api.ts";

import {
    BUFFER_FILL_COLOR,
    BUFFER_FILL_OPACITY,
    BUFFER_LAYER_ID,
    DIRECT_SELECT,
    DRAW_CREATE_EVENT,
    DRAW_DELETE_EVENT,
    DRAW_SELECTION_CHANGE_EVENT,
    DRAW_UPDATE_EVENT,
    GEOMETRY_TYPE_LINESTRING,
    GEOMETRY_TYPE_POINT,
    GEOMETRY_TYPE_POLYGON,
    IDLE,
    METERS,
    SIMPLE_SELECT,
    STYLE_LOAD_EVENT,
} from "@/arches_component_lab/widgets/MapWidget/constants.ts";

import type { Ref } from "vue";
import type { Feature, FeatureCollection } from "geojson";
import type {
    AddLayerObject,
    GeoJSONSource,
    Map,
    MapGeoJSONFeature,
    MapMouseEvent,
    Popup,
    SourceSpecification,
} from "maplibre-gl";

import type { GeoJSONFeatureCollectionValue } from "@/arches_component_lab/datatypes/geojson-feature-collection/types.ts";
import type {
    Basemap,
    LayerDefinition,
    MapCardXNodeXWidgetData,
    MapInteractionItem,
    MapLayer,
    MapSource,
    RawBasemap,
} from "@/arches_component_lab/widgets/MapWidget/types.ts";

interface DrawEvent {
    features: Feature[];
}

const {
    aliasedNodeData,
    cardXNodeXWidgetData,
    shouldEmitSimplifiedValue = false,
    overlays: overlaysProp = [],
    sources = [],
} = defineProps<{
    aliasedNodeData: GeoJSONFeatureCollectionValue | null;
    cardXNodeXWidgetData?: MapCardXNodeXWidgetData;
    shouldEmitSimplifiedValue?: boolean;
    overlays?: MapLayer[];
    sources?: MapSource[];
}>();

const emit = defineEmits<{
    (
        event: "update:value",
        value: GeoJSONFeatureCollectionValue | FeatureCollection,
    ): void;
}>();

const { $gettext } = useGettext();

const mapContainer = useTemplateRef<HTMLDivElement>("mapContainer");

const map = shallowRef<Map | null>(null);
const selectedDrawnFeature: Ref<Feature | null> = ref(null);
const basemaps = ref<Basemap[]>([]);
const localOverlays = ref<MapLayer[]>([...overlaysProp]);
const overlayLayerIds = computed(() =>
    localOverlays.value
        .filter((overlay) => overlay.addtomap)
        .flatMap((overlay) =>
            overlay.layerdefinitions.map((layerDef) => layerDef.id),
        ),
);
const popupFeatures = ref<MapGeoJSONFeature[]>([]);
const popupContainer = ref<HTMLElement | null>(null);
let activePopup: Popup | null = null;

let draw: InstanceType<typeof MapboxDraw>;
let drawInitialized = false;
let boundsInitialized = false;
let basemapInitialized = false;
let mapSources: MapSource[] = [];
let defaultBounds: [number, number, number, number] | null = null;

const mapInteractionItems: MapInteractionItem[] = [
    {
        name: $gettext("Draw"),
        header: $gettext("Draw"),
        component: MapFilter,
        icon: "pi pi-pencil",
    },
    {
        name: $gettext("Basemap"),
        header: $gettext("Basemap"),
        component: BasemapControls,
        icon: "pi pi-map",
    },
    {
        name: $gettext("Overlays"),
        header: $gettext("Overlays"),
        component: OverlayControls,
        icon: "pi pi-globe",
    },
];

provide("basemaps", basemaps);
provide("overlays", localOverlays);
provide("selectedDrawnFeature", selectedDrawnFeature);
provide(
    "geometryTypes",
    computed(
        () =>
            cardXNodeXWidgetData?.config?.geometryTypes?.map((gt) =>
                gt.id.toLowerCase(),
            ) ?? null,
    ),
);

watch(
    () => overlaysProp,
    (updated) => {
        localOverlays.value = [...updated];
    },
);

watch(
    basemaps,
    (updated) => {
        if (!basemapInitialized) {
            basemapInitialized = true;
            return;
        }
        const active = updated.find((basemap) => basemap.active);
        if (active && map.value) {
            map.value.setStyle(active.url, { diff: false });
        }
    },
    { deep: true },
);

watch(
    localOverlays,
    (overlays) => {
        if (map.value && map.value.isStyleLoaded()) {
            updateMapOverlays(overlays);
        }
    },
    { deep: true },
);

onMounted(async () => {
    const config = cardXNodeXWidgetData?.config;
    map.value = new maplibregl.Map({
        container: mapContainer.value!,
        zoom: config?.zoom ?? 2,
        center: [config?.centerX ?? 0, config?.centerY ?? 0],
        pitch: config?.pitch ?? 0,
        bearing: config?.bearing ?? 0,
        ...(config?.minZoom != null ? { minZoom: config.minZoom } : {}),
        ...(config?.maxZoom != null ? { maxZoom: config.maxZoom } : {}),
        attributionControl: { compact: true },
    });

    map.value.addControl(new maplibregl.NavigationControl(), "top-left");

    map.value.on("click", (e: MapMouseEvent) => {
        if (!overlayLayerIds.value.length) return;
        const features = map.value!.queryRenderedFeatures(e.point, {
            layers: overlayLayerIds.value,
        });
        if (!features.length) return;

        const seen = new Set<string>();
        const unique = features.filter((feature: MapGeoJSONFeature) => {
            const id = String(
                feature.properties?.resourceinstanceid ?? feature.id ?? "",
            );
            if (!id || seen.has(id)) return false;
            seen.add(id);
            return true;
        });

        if (activePopup) activePopup.remove();

        const container = document.createElement("div");
        container.style.height = "100%";
        activePopup = new maplibregl.Popup({
            maxWidth: "none",
            className: "feature-info-popup",
        })
            .setDOMContent(container)
            .setLngLat(e.lngLat)
            .addTo(map.value!);

        popupContainer.value = container;
        popupFeatures.value = unique;

        activePopup.on("close", () => {
            popupContainer.value = null;
            popupFeatures.value = [];
            activePopup = null;
        });
    });

    map.value.on("mousemove", (e: MapMouseEvent) => {
        let features: MapGeoJSONFeature[] = [];
        if (overlayLayerIds.value.length) {
            features = map.value!.queryRenderedFeatures(e.point, {
                layers: overlayLayerIds.value,
            });
        }
        map.value!.getCanvas().style.cursor = features.length ? "pointer" : "";
    });

    // Register before the async API call so no style.load event can slip by.
    // Using `on` (not `once`) so it re-fires on every style change (basemap switch).
    map.value.on(STYLE_LOAD_EVENT, () => {
        if (!drawInitialized) {
            setupDraw();
            drawInitialized = true;
        }
        if (!boundsInitialized && defaultBounds) {
            boundsInitialized = true;
            map.value!.fitBounds(
                [
                    [defaultBounds[0], defaultBounds[1]],
                    [defaultBounds[2], defaultBounds[3]],
                ],
                { padding: 20 },
            );
        }
        map.value!.resize();
        addBufferLayer();
        updateMapOverlays(localOverlays.value);
    });

    try {
        const [settings, mapData] = await Promise.all([
            fetchMapSettings(),
            fetchMapData(),
        ]);

        const resourceSources: MapSource[] = (
            (mapData?.resource_map_sources ?? []) as {
                name: string;
                source: MapSource["source"];
            }[]
        ).map((rawSource) => ({
            id: 0,
            name: rawSource.name,
            source: rawSource.source,
        }));
        mapSources = [
            ...((mapData?.map_sources ?? []) as MapSource[]),
            ...resourceSources,
        ];

        basemaps.value = ((mapData?.basemaps ?? []) as RawBasemap[]).map(
            (layer) => ({
                id: layer.name,
                name: layer.title,
                value: layer.name,
                active: layer.addtomap,
                url: layer.url,
            }),
        );

        const configuredOverlays = (
            (mapData?.map_layers ?? []) as MapLayer[]
        ).filter(
            (layer) =>
                layer.isoverlay &&
                layer.activated !== false &&
                !layer.searchonly,
        );
        const resourceLayers: MapLayer[] = (mapData?.resource_map_layers ??
            []) as MapLayer[];
        const fetchedOverlays = [...configuredOverlays, ...resourceLayers].sort(
            (overlayA, overlayB) =>
                (overlayA.sortorder ?? 0) - (overlayB.sortorder ?? 0),
        );
        if (fetchedOverlays.length && !overlaysProp.length) {
            localOverlays.value = fetchedOverlays;
        }

        if (settings?.DEFAULT_BOUNDS) {
            defaultBounds = geojsonExtent(settings.DEFAULT_BOUNDS);
        }

        const preferredBasemap = config?.basemap
            ? basemaps.value.find((b) => b.value === config.basemap)
            : null;
        const activeBasemap =
            preferredBasemap ?? basemaps.value.find((b) => b.active);
        if (activeBasemap?.url) {
            map.value.setStyle(activeBasemap.url);
        }
    } catch (_error) {
        // proceed with default empty style
    }
});

onUnmounted(() => {
    if (map.value) {
        map.value.remove();
    }
});

function setupDraw() {
    draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            point: false,
            line_string: false,
            polygon: false,
            trash: false,
        },
    });

    map.value!.addControl(draw);

    if (aliasedNodeData?.node_value?.features?.length) {
        aliasedNodeData.node_value.features.forEach((feature) => {
            draw.add(feature);
        });
        updateDrawnFeatures();
    }

    map.value!.on(DRAW_CREATE_EVENT, (e: DrawEvent) => {
        selectNewlyDrawnFeature(e);
        updateDrawnFeatures();
    });

    map.value!.on(DRAW_UPDATE_EVENT, (e: DrawEvent) => {
        selectedDrawnFeature.value = e.features[0] ?? null;
        updateDrawnFeatures();
    });

    map.value!.on(DRAW_DELETE_EVENT, () => {
        selectedDrawnFeature.value = null;
        updateDrawnFeatures();
    });

    map.value!.on(DRAW_SELECTION_CHANGE_EVENT, (e: DrawEvent) => {
        selectedDrawnFeature.value = e.features[0] ?? null;
    });
}

function addBufferLayer() {
    if (!map.value!.getSource(BUFFER_LAYER_ID)) {
        map.value!.addSource(BUFFER_LAYER_ID, {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
        });
    }
    if (!map.value!.getLayer(BUFFER_LAYER_ID)) {
        map.value!.addLayer({
            id: BUFFER_LAYER_ID,
            type: "fill",
            source: BUFFER_LAYER_ID,
            layout: {},
            paint: {
                "fill-color": BUFFER_FILL_COLOR,
                "fill-opacity": BUFFER_FILL_OPACITY,
            },
        });
    }
}

function selectNewlyDrawnFeature(e: DrawEvent) {
    const feature = e.features[0];
    const featureId = feature.id as string;

    map.value!.once(IDLE, () => {
        if (feature.geometry.type === GEOMETRY_TYPE_POINT) {
            draw.changeMode(SIMPLE_SELECT, { featureIds: [featureId] });
        } else if (
            feature.geometry.type === GEOMETRY_TYPE_LINESTRING ||
            feature.geometry.type === GEOMETRY_TYPE_POLYGON
        ) {
            draw.changeMode(DIRECT_SELECT, { featureId });
        }
    });
}

async function updateDrawnFeatures() {
    const drawnFeatures = draw.getAll() as FeatureCollection;

    for (const feature of drawnFeatures.features) {
        if (!feature.properties!.buffer_distance) {
            feature.properties!.buffer_distance = 0;
        }
        if (!feature.properties!.buffer_units) {
            feature.properties!.buffer_units = METERS;
        }
    }

    try {
        const featuresToBuffer: FeatureCollection = {
            ...drawnFeatures,
            features: drawnFeatures.features.filter(
                (feature) => feature.properties!.buffer_distance,
            ),
        };
        let bufferedFeatures: FeatureCollection = {
            type: "FeatureCollection",
            features: [],
        };
        if (featuresToBuffer.features.length) {
            bufferedFeatures = await fetchDrawnFeaturesBuffer(featuresToBuffer);
        }
        const source = map.value!.getSource(BUFFER_LAYER_ID) as GeoJSONSource;
        if (source) {
            source.setData(bufferedFeatures);
        }

        if (drawnFeatures.features.length) {
            const allFeatures: FeatureCollection = {
                type: "FeatureCollection",
                features: [
                    ...drawnFeatures.features,
                    ...bufferedFeatures.features,
                ],
            };
            const bounds = await fetchGeoJSONBounds(allFeatures);
            map.value!.fitBounds(
                [
                    [bounds[0], bounds[1]],
                    [bounds[2], bounds[3]],
                ],
                { padding: { top: 50, right: 100, bottom: 50, left: 50 } },
            );
        }
    } catch (_error) {
        // buffer/bounds fetch failed; continue with drawn features only
    }

    const count = drawnFeatures.features.length;
    const displayValue = $gettext("%{ count } feature(s)", {
        " count ": String(count),
    });

    if (shouldEmitSimplifiedValue) {
        emit("update:value", drawnFeatures);
    } else {
        emit("update:value", {
            display_value: displayValue,
            node_value: drawnFeatures,
            details: [],
        });
    }
}

function addOverlayToMap(overlay: MapLayer) {
    const allSources = [...sources, ...mapSources];
    overlay.layerdefinitions.forEach((layerDef: LayerDefinition) => {
        try {
            if (layerDef.source && !map.value!.getSource(layerDef.source)) {
                const sourceSpec = allSources.find(
                    (mapSource) => mapSource.name === layerDef.source,
                );
                if (sourceSpec) {
                    map.value!.addSource(
                        layerDef.source,
                        sourceSpec.source as SourceSpecification,
                    );
                }
            }
            if (!map.value!.getLayer(layerDef.id)) {
                map.value!.addLayer(layerDef as AddLayerObject);
            }
        } catch (_e) {
            // skip layers that can't be added to this style
        }
    });
}

function removeOverlayFromMap(overlay: MapLayer) {
    const sourcesToRemove: Record<string, boolean> = {};

    overlay.layerdefinitions.forEach((layerDef: LayerDefinition) => {
        if (map.value!.getLayer(layerDef.id)) {
            map.value!.removeLayer(layerDef.id);
            if (layerDef.source) {
                sourcesToRemove[layerDef.source] = true;
            }
        }
    });

    map.value!.getStyle()?.layers.forEach((layer: LayerDefinition) => {
        const src = layer.source;
        if (src && sourcesToRemove[src]) {
            delete sourcesToRemove[src];
        }
    });

    for (const source of Object.keys(sourcesToRemove)) {
        if (map.value!.getSource(source)) {
            map.value!.removeSource(source);
        }
    }
}

function updateMapOverlays(overlays: MapLayer[]) {
    for (const overlay of overlays) {
        overlay.layerdefinitions.forEach((layerDef: LayerDefinition) => {
            if (map.value!.getLayer(layerDef.id)) {
                map.value!.removeLayer(layerDef.id);
            }
        });
    }
    for (const overlay of overlays) {
        if (overlay.addtomap) {
            addOverlayToMap(overlay);
        } else {
            removeOverlayFromMap(overlay);
        }
    }
}
</script>

<template>
    <div class="map-widget-editor">
        <div
            ref="mapContainer"
            class="map-container"
        />
        <InteractionsDrawer
            v-if="map"
            position="right"
            :map="map as Map"
            :items="mapInteractionItems"
            :default-open-index="0"
        />
    </div>
    <Teleport
        v-if="popupContainer"
        :to="popupContainer"
    >
        <FeaturePopup :features="popupFeatures" />
    </Teleport>
</template>

<style>
.feature-info-popup .maplibregl-popup-content {
    display: flex;
    flex-direction: column;
    width: 30rem;
    min-height: 10rem;
    padding: 0;
    background: var(--p-content-background);
    color: var(--p-content-color);
}

.feature-info-popup .maplibregl-popup-close-button {
    color: var(--p-content-color);
    font-size: 1.75rem;
    padding: 0.375rem 0.75rem;
    line-height: 1;
}
</style>

<style scoped>
.map-widget-editor {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex: 1;
    min-height: 25rem;
    overflow: hidden;
}

.map-container {
    flex: 1;
    min-width: 0;
}
</style>
