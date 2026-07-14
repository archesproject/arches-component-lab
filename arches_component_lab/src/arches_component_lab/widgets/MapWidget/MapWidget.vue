<script setup lang="ts">
import { computed, useTemplateRef } from "vue";

import MapWidgetEditor from "@/arches_component_lab/widgets/MapWidget/components/MapWidgetEditor/MapWidgetEditor.vue";
import MapWidgetViewer from "@/arches_component_lab/widgets/MapWidget/components/MapWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";
import { buildGeoJSONFeatureCollectionAliasedNodeData } from "@/arches_component_lab/datatypes/geojson-feature-collection/utils.ts";

import type { PropType } from "vue";
import type { FeatureCollection } from "geojson";

import type { GeoJSONFeatureCollectionAliasedNodeData } from "@/arches_component_lab/datatypes/geojson-feature-collection/types.ts";
import type { MapWidgetProps } from "@/arches_component_lab/widgets/MapWidget/types.ts";

const { aliasedNodeData, value } = defineProps({
    mode: {
        type: String as PropType<MapWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<MapWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<MapWidgetProps["graphSlug"]>,
        default: undefined,
    },
    renderContext: {
        type: String as PropType<MapWidgetProps["renderContext"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<MapWidgetProps["cardXNodeXWidgetData"]>,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<MapWidgetProps["aliasedNodeData"]>,
        default: undefined,
    },
    value: {
        type: Object as PropType<MapWidgetProps["value"]>,
        default: undefined,
    },
});

interface MapWidgetEmits {
    (event: "update:isLoading", isLoading: boolean): void;
    (event: "update:value", updatedValue: FeatureCollection): void;
    (event: "update:overlays"): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: GeoJSONFeatureCollectionAliasedNodeData,
    ): void;
    (
        event: "initialized",
        updatedValue: GeoJSONFeatureCollectionAliasedNodeData,
    ): void;
}

const emit: MapWidgetEmits = defineEmits([
    "update:isLoading",
    "update:value",
    "update:overlays",
    "update:aliasedNodeData",
    "initialized",
]);

const resolvedAliasedNodeData = computed(
    () =>
        aliasedNodeData ??
        buildGeoJSONFeatureCollectionAliasedNodeData(value ?? null),
);

const editorRef =
    useTemplateRef<InstanceType<typeof MapWidgetEditor>>("editor");

defineExpose({
    map: computed(() => editorRef.value?.map ?? null),
});
</script>

<template>
    <MapWidgetEditor
        v-if="mode === EDIT"
        ref="editor"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="resolvedAliasedNodeData"
        :render-context="renderContext"
        @update:is-loading="emit('update:isLoading', $event)"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
        @update:overlays="emit('update:overlays')"
        @initialized="emit('initialized', $event)"
    />
    <MapWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="resolvedAliasedNodeData"
        @update:is-loading="emit('update:isLoading', $event)"
    />
</template>
