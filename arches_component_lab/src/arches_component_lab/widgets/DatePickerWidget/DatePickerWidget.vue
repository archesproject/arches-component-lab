<script setup lang="ts">
import { computed } from "vue";

import DatePickerWidgetEditor from "@/arches_component_lab/widgets/DatePickerWidget/components/DatePickerWidgetEditor.vue";
import DatePickerWidgetViewer from "@/arches_component_lab/widgets/DatePickerWidget/components/DatePickerWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";
import type {
    DateAliasedNodeData,
    DateDatatypeCardXNodeXWidgetData,
} from "@/arches_component_lab/datatypes/date/types.ts";

const { aliasedNodeData, value } = defineProps<{
    mode: WidgetMode;
    nodeAlias?: string;
    graphSlug?: string;
    cardXNodeXWidgetData?: DateDatatypeCardXNodeXWidgetData;
    aliasedNodeData?: DateAliasedNodeData | null;
    value?: string | null;
}>();

const emit = defineEmits<{
    "update:value": [updatedValue: string | null];
    "update:aliasedNodeData": [updatedValue: DateAliasedNodeData];
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
    <DatePickerWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
    />
    <DatePickerWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
    />
</template>
