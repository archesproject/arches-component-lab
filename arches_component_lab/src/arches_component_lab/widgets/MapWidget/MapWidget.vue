<script setup lang="ts">
import MapWidgetEditor from "@/arches_component_lab/widgets/MapWidget/components/MapWidgetEditor/MapWidgetEditor.vue";
import MapWidgetViewer from "@/arches_component_lab/widgets/MapWidget/components/MapWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { GeoJSONFeatureCollectionValue } from "@/arches_component_lab/datatypes/geojson-feature-collection/types.ts";
import type { MapCardXNodeXWidgetData } from "@/arches_component_lab/widgets/MapWidget/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    mode: WidgetMode;
    nodeAlias?: string;
    graphSlug?: string;
    cardXNodeXWidgetData?: MapCardXNodeXWidgetData;
    aliasedNodeData: GeoJSONFeatureCollectionValue | null;
    shouldEmitSimplifiedValue?: boolean;
}>();

const emit = defineEmits(["update:isLoading", "update:value"]);
</script>

<template>
    <MapWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="aliasedNodeData"
        :should-emit-simplified-value="shouldEmitSimplifiedValue"
        @update:is-loading="emit('update:isLoading', $event)"
        @update:value="emit('update:value', $event)"
    />
    <MapWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="aliasedNodeData"
        @update:is-loading="emit('update:isLoading', $event)"
    />
</template>
