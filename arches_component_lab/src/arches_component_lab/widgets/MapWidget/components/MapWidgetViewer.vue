<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";

import maplibregl from "maplibre-gl";
import Skeleton from "primevue/skeleton";

import {
    fetchMapData,
    fetchGeoJSONBounds,
} from "@/arches_component_lab/widgets/MapWidget/api.ts";

import {
    DEFAULT_FEATURE_COLOR,
    DEFAULT_FEATURE_LINE_WIDTH,
    DEFAULT_FEATURE_POINT_FILL,
    DEFAULT_FEATURE_POINT_SIZE,
    STYLE_LOAD_EVENT,
    VIEWER_SOURCE_ID,
} from "@/arches_component_lab/widgets/MapWidget/constants.ts";

import type { FeatureCollection } from "geojson";
import type { GeoJSONSource, Map as MaplibreMap } from "maplibre-gl";

import type { GeoJSONFeatureCollectionValue } from "@/arches_component_lab/datatypes/geojson-feature-collection/types.ts";
import type {
    MapCardXNodeXWidgetData,
    RawBasemap,
} from "@/arches_component_lab/widgets/MapWidget/types.ts";

const { cardXNodeXWidgetData, aliasedNodeData } = defineProps<{
    cardXNodeXWidgetData?: MapCardXNodeXWidgetData;
    aliasedNodeData: GeoJSONFeatureCollectionValue | null;
}>();

const emit = defineEmits<{
    (event: "update:isLoading", isLoading: boolean): void;
}>();

const mapContainer = useTemplateRef<HTMLDivElement>("mapContainer");

const isLoading = ref(false);

let map: MaplibreMap | null = null;

watch(isLoading, (newValue) => {
    emit("update:isLoading", newValue);
});

watch(
    () => aliasedNodeData,
    () => {
        if (map?.getSource(VIEWER_SOURCE_ID)) {
            const source = map.getSource(VIEWER_SOURCE_ID) as GeoJSONSource;
            source.setData(
                aliasedNodeData?.node_value ?? {
                    type: "FeatureCollection",
                    features: [],
                },
            );
            fitToFeatures();
        }
    },
);

onMounted(async () => {
    const config = cardXNodeXWidgetData?.config;

    map = new maplibregl.Map({
        container: mapContainer.value!,
        zoom: config?.zoom ?? 10,
        center: [config?.centerX ?? 0, config?.centerY ?? 0],
        pitch: config?.pitch ?? 0,
        bearing: config?.bearing ?? 0,
        ...(config?.minZoom != null ? { minZoom: config.minZoom } : {}),
        ...(config?.maxZoom != null ? { maxZoom: config.maxZoom } : {}),
        interactive: false,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-left");

    map.once(STYLE_LOAD_EVENT, () => {
        addFeatureLayers();
    });

    await loadMapData();
});

onUnmounted(() => {
    map?.remove();
});

async function loadMapData() {
    const config = cardXNodeXWidgetData?.config;
    isLoading.value = true;
    try {
        const mapData = await fetchMapData();

        if (mapData?.default_bounds && !config?.centerX && !config?.centerY) {
            map!.fitBounds(
                mapData.default_bounds as [number, number, number, number],
            );
        }

        const basemaps = (mapData?.basemaps ?? []) as RawBasemap[];
        const preferredBasemap = config?.basemap
            ? basemaps.find((basemap) => basemap.name === config.basemap)
            : null;
        const activeBasemap =
            preferredBasemap ?? basemaps.find((basemap) => basemap.addtomap);
        if (activeBasemap?.url) {
            map!.setStyle(activeBasemap.url);
        }
    } catch (error) {
        console.error("Error loading map data:", error);
    } finally {
        isLoading.value = false;
    }
}

function addFeatureLayers() {
    const config = cardXNodeXWidgetData?.config;
    const featureColor = config?.featureColor ?? DEFAULT_FEATURE_COLOR;
    const featureLineWidth =
        config?.featureLineWidth ?? DEFAULT_FEATURE_LINE_WIDTH;
    const featurePointSize =
        config?.featurePointSize ?? DEFAULT_FEATURE_POINT_SIZE;

    const featureCollection: FeatureCollection =
        aliasedNodeData?.node_value ?? {
            type: "FeatureCollection",
            features: [],
        };

    map!.addSource(VIEWER_SOURCE_ID, {
        type: "geojson",
        data: featureCollection,
    });

    map!.addLayer({
        id: `${VIEWER_SOURCE_ID}-fill`,
        type: "fill",
        source: VIEWER_SOURCE_ID,
        filter: ["==", "$type", "Polygon"],
        paint: {
            "fill-color": featureColor,
            "fill-opacity": 0.3,
        },
    });

    map!.addLayer({
        id: `${VIEWER_SOURCE_ID}-line`,
        type: "line",
        source: VIEWER_SOURCE_ID,
        filter: ["in", "$type", "LineString", "Polygon"],
        paint: {
            "line-color": featureColor,
            "line-width": featureLineWidth,
        },
    });

    map!.addLayer({
        id: `${VIEWER_SOURCE_ID}-circle`,
        type: "circle",
        source: VIEWER_SOURCE_ID,
        filter: ["==", "$type", "Point"],
        paint: {
            "circle-color": DEFAULT_FEATURE_POINT_FILL,
            "circle-radius": featurePointSize,
            "circle-stroke-color": featureColor,
            "circle-stroke-width": featureLineWidth,
        },
    });

    fitToFeatures();
}

async function fitToFeatures() {
    const features = aliasedNodeData?.node_value;
    if (!features?.features?.length) return;

    try {
        const bounds = await fetchGeoJSONBounds(features);
        map!.fitBounds(
            [
                [bounds[0], bounds[1]],
                [bounds[2], bounds[3]],
            ],
            { padding: { top: 50, right: 50, bottom: 50, left: 50 } },
        );
    } catch (error) {
        console.error(error);
    }
}
</script>

<template>
    <div class="map-viewer">
        <div
            ref="mapContainer"
            class="map-container"
        />
        <Skeleton
            v-if="isLoading"
            class="map-loading-skeleton"
        />
    </div>
</template>

<style scoped>
.map-viewer {
    position: relative;
    height: 18.75rem;
    width: 100%;
}

.map-container {
    height: 100%;
    width: 100%;
}

.map-loading-skeleton {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    border-radius: 0;
}
</style>
