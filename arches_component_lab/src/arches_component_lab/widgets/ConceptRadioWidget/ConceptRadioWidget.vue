<script setup lang="ts">
import ConceptRadioWidgetEditor from "@/arches_component_lab/widgets/ConceptRadioWidget/components/ConceptRadioWidgetEditor.vue";
import ConceptRadioWidgetViewer from "@/arches_component_lab/widgets/ConceptRadioWidget/components/ConceptRadioWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { ConceptRadioCardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: ConceptRadioCardXNodeXWidgetData;
    nodeValue: string | null;
}>();

const emit = defineEmits([
    "update:isDirty",
    "update:isLoading",
    "update:value",
]);
</script>

<template>
    <ConceptRadioWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
        :node-value="nodeValue"
        @update:is-loading="emit('update:isLoading', $event)"
        @update:value="emit('update:value', $event)"
    />
    <ConceptRadioWidgetViewer
        v-if="mode === VIEW"
        :node-value="nodeValue"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
    />
</template>
