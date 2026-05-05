<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from "vue";

import maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

import {
    fetchMapSettings,
    fetchMapData,
    fetchGeoJSONBounds,
} from "@/arches_component_lab/widgets/MapWidget/api.ts";

import { STYLE_LOAD_EVENT } from "@/arches_component_lab/widgets/MapWidget/constants.ts";

import type { FeatureCollection } from "geojson";
import type { GeoJSONSource, Map } from "maplibre-gl";

import type { GeoJSONFeatureCollectionValue } from "@/arches_component_lab/datatypes/geojson-feature-collection/types.ts";
import type {
    MapCardXNodeXWidgetData,
    RawBasemap,
} from "@/arches_component_lab/widgets/MapWidget/types.ts";

const SOURCE_ID = "widget-features";
const DEFAULT_FEATURE_COLOR = "#c12";
const DEFAULT_FEATURE_POINT_FILL = "#ffffff";
const DEFAULT_FEATURE_LINE_WIDTH = 2;
const DEFAULT_FEATURE_POINT_SIZE = 6;

const props = defineProps<{
    cardXNodeXWidgetData?: MapCardXNodeXWidgetData;
    aliasedNodeData: GeoJSONFeatureCollectionValue | null;
}>();

const mapContainer = useTemplateRef<HTMLDivElement>("mapContainer");

let map: Map | null = null;

onMounted(async () => {
    const config = props.cardXNodeXWidgetData?.config;

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

    try {
        const [settings, mapData] = await Promise.all([
            fetchMapSettings(),
            fetchMapData(),
        ]);

        if (settings?.DEFAULT_BOUNDS && !config?.centerX && !config?.centerY) {
            map.fitBounds(
                settings.DEFAULT_BOUNDS as [number, number, number, number],
            );
        }

        const basemaps = (mapData?.basemaps ?? []) as RawBasemap[];
        const preferredBasemap = config?.basemap
            ? basemaps.find((b) => b.name === config.basemap)
            : null;
        const activeBasemap =
            preferredBasemap ?? basemaps.find((b) => b.addtomap);
        if (activeBasemap?.url) {
            map.setStyle(activeBasemap.url);
        }
    } catch (_error) {
        // proceed with default empty style
    }

    map.once(STYLE_LOAD_EVENT, () => {
        addFeatureLayers();
    });
});

onUnmounted(() => {
    if (map) {
        map.remove();
    }
});

watch(
    () => props.aliasedNodeData,
    () => {
        if (map?.getSource(SOURCE_ID)) {
            const source = map.getSource(SOURCE_ID) as GeoJSONSource;
            source.setData(
                props.aliasedNodeData?.node_value ?? {
                    type: "FeatureCollection",
                    features: [],
                },
            );
            fitToFeatures();
        }
    },
);

function addFeatureLayers() {
    const config = props.cardXNodeXWidgetData?.config;
    const featureColor = config?.featureColor ?? DEFAULT_FEATURE_COLOR;
    const featureLineWidth =
        config?.featureLineWidth ?? DEFAULT_FEATURE_LINE_WIDTH;
    const featurePointSize =
        config?.featurePointSize ?? DEFAULT_FEATURE_POINT_SIZE;

    const featureCollection: FeatureCollection = props.aliasedNodeData
        ?.node_value ?? {
        type: "FeatureCollection",
        features: [],
    };

    map!.addSource(SOURCE_ID, {
        type: "geojson",
        data: featureCollection,
    });

    map!.addLayer({
        id: `${SOURCE_ID}-fill`,
        type: "fill",
        source: SOURCE_ID,
        filter: ["==", "$type", "Polygon"],
        paint: {
            "fill-color": featureColor,
            "fill-opacity": 0.3,
        },
    });

    map!.addLayer({
        id: `${SOURCE_ID}-line`,
        type: "line",
        source: SOURCE_ID,
        filter: ["in", "$type", "LineString", "Polygon"],
        paint: {
            "line-color": featureColor,
            "line-width": featureLineWidth,
        },
    });

    map!.addLayer({
        id: `${SOURCE_ID}-circle`,
        type: "circle",
        source: SOURCE_ID,
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
    const features = props.aliasedNodeData?.node_value;
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
    } catch (_error) {
        // skip fit if bounds fetch fails
    }
}
</script>

<template>
    <div
        ref="mapContainer"
        class="map-viewer"
    />
</template>

<style scoped>
.map-viewer {
    height: 18.75rem;
    width: 100%;
}
</style>
