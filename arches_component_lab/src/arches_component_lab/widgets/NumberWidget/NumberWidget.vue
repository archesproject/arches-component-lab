<script setup lang="ts">
import NumberWidgetEditor from "@/arches_component_lab/widgets/NumberWidget/components/NumberWidgetEditor.vue";
import NumberWidgetViewer from "@/arches_component_lab/widgets/NumberWidget/components/NumberWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { NumberCardXNodeXWidgetData } from "@/arches_component_lab/datatypes/number/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: NumberCardXNodeXWidgetData;
    value: number | null;
}>();

const emit = defineEmits(["update:isDirty", "update:value"]);
</script>

<template>
    <NumberWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="value"
        @update:value="emit('update:value', $event)"
    />
    <NumberWidgetViewer
        v-if="mode === VIEW"
        :value="value"
    />
</template>
