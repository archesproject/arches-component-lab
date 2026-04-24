<script setup lang="ts">
import ConceptSelectWidgetEditor from "@/arches_component_lab/widgets/ConceptSelectWidget/components/ConceptSelectWidgetEditor.vue";
import ConceptSelectWidgetViewer from "@/arches_component_lab/widgets/ConceptSelectWidget/components/ConceptSelectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    nodeValue: string | null;
}>();

const emit = defineEmits(["update:isLoading", "update:value"]);
</script>

<template>
    <ConceptSelectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
        :node-value="nodeValue"
        @update:is-loading="emit('update:isLoading', $event)"
        @update:value="emit('update:value', $event)"
    />
    <ConceptSelectWidgetViewer
        v-if="mode === VIEW"
        :node-value="nodeValue"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
    />
</template>
