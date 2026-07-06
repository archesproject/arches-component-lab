<script setup lang="ts">
import { computed } from "vue";

import EDTFWidgetEditor from "@/arches_component_lab/widgets/EDTFWidget/components/EDTFWidgetEditor/EDTFWidgetEditor.vue";
import EDTFWidgetViewer from "@/arches_component_lab/widgets/EDTFWidget/components/EDTFWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { EDTFAliasedNodeData } from "@/arches_component_lab/datatypes/edtf/types.ts";
import type { EDTFWidgetProps } from "./types.ts";

const { aliasedNodeData, value } = defineProps<EDTFWidgetProps>();

const emit = defineEmits<{
    "update:isDirty": [isDirty: boolean];
    "update:value": [updatedValue: string];
    "update:aliasedNodeData": [updatedValue: EDTFAliasedNodeData];
    initialized: [updatedValue: EDTFAliasedNodeData];
}>();

// aliasedNodeData !== undefined means the caller passed it (even if null);
// undefined means the prop was omitted, so fall back to the raw value.
const resolvedNodeValue = computed<string | null>(() => {
    if (aliasedNodeData !== undefined) {
        return aliasedNodeData?.node_value ?? null;
    }
    return value ?? null;
});
</script>

<template>
    <EDTFWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
        @initialized="emit('initialized', $event)"
    />
    <EDTFWidgetViewer
        v-if="mode === VIEW"
        :value="resolvedNodeValue"
    />
</template>
