<script setup lang="ts">
import MapWidgetEditor from "@/arches_component_lab/widgets/MapWidget/components/MapWidgetEditor.vue";
import MapWidgetViewer from "@/arches_component_lab/widgets/MapWidget/components/MapWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";
import type { FeatureCollection } from "geojson";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    nodeValue: FeatureCollection | null;
}>();

const emit = defineEmits(["update:value"]);
</script>

<template>
    <MapWidgetEditor
        v-if="mode === EDIT"
        :node-value="nodeValue"
        @update:value="emit('update:value', $event)"
    />
    <MapWidgetViewer
        v-if="mode === VIEW"
        :node-value="nodeValue"
    />
</template>
