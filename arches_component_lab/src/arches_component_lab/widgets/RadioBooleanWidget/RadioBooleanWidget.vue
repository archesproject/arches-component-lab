<script setup lang="ts">
import RadioBooleanWidgetEditor from "@/arches_component_lab/widgets/RadioBooleanWidget/components/RadioBooleanWidgetEditor.vue";
import RadioBooleanWidgetViewer from "@/arches_component_lab/widgets/RadioBooleanWidget/components/RadioBooleanWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { BooleanCardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: BooleanCardXNodeXWidgetData;
    nodeValue: boolean | null;
}>();

const emit = defineEmits(["update:value"]);
</script>

<template>
    <RadioBooleanWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :node-value="nodeValue"
        @update:value="emit('update:value', $event)"
    />
    <RadioBooleanWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :node-value="nodeValue"
    />
</template>

<style scoped>
.widget {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
}
</style>
