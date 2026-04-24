<script setup lang="ts">
import SwitchWidgetEditor from "@/arches_component_lab/widgets/SwitchWidget/components/SwitchWidgetEditor.vue";
import SwitchWidgetViewer from "@/arches_component_lab/widgets/SwitchWidget/components/SwitchWidgetViewer.vue";

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
    <SwitchWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :node-value="nodeValue"
        @update:value="emit('update:value', $event)"
    />
    <SwitchWidgetViewer
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
