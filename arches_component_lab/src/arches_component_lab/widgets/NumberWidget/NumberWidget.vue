<script setup lang="ts">
import { computed } from "vue";

import NumberWidgetEditor from "@/arches_component_lab/widgets/NumberWidget/components/NumberWidgetEditor.vue";
import NumberWidgetViewer from "@/arches_component_lab/widgets/NumberWidget/components/NumberWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { NumberAliasedNodeData } from "@/arches_component_lab/datatypes/number/types.ts";
import type { NumberWidgetProps } from "./types.ts";

const { aliasedNodeData, value } = defineProps<NumberWidgetProps>();

const emit = defineEmits<{
    "update:isDirty": [isDirty: boolean];
    "update:value": [updatedValue: number | null];
    "update:aliasedNodeData": [updatedValue: NumberAliasedNodeData];
    initialized: [updatedValue: NumberAliasedNodeData];
}>();

// aliasedNodeData !== undefined means the caller passed it (even if null);
// undefined means the prop was omitted, so fall back to the raw value.
const resolvedNodeValue = computed<number | null>(() => {
    if (aliasedNodeData !== undefined) {
        return aliasedNodeData?.node_value ?? null;
    }
    return value ?? null;
});
</script>

<template>
    <NumberWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
        @initialized="emit('initialized', $event)"
    />
    <NumberWidgetViewer
        v-if="mode === VIEW"
        :value="resolvedNodeValue"
    />
</template>
