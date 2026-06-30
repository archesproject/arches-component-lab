<script setup lang="ts">
import { computed } from "vue";

import DomainRadioWidgetEditor from "@/arches_component_lab/widgets/DomainRadioWidget/components/DomainRadioWidgetEditor.vue";
import DomainRadioWidgetViewer from "@/arches_component_lab/widgets/DomainRadioWidget/components/DomainRadioWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type {
    DomainAliasedNodeData,
    DomainDatatypeCardXNodeXWidgetData,
} from "@/arches_component_lab/datatypes/domain/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

const { aliasedNodeData, value } = defineProps<{
    mode: WidgetMode;
    nodeAlias?: string;
    graphSlug?: string;
    cardXNodeXWidgetData?: DomainDatatypeCardXNodeXWidgetData;
    aliasedNodeData?: DomainAliasedNodeData | null;
    value?: string | null;
}>();

const emit = defineEmits<{
    "update:value": [updatedValue: string | null];
    "update:aliasedNodeData": [updatedValue: DomainAliasedNodeData];
    initialized: [updatedValue: DomainAliasedNodeData];
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
    <DomainRadioWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
        @initialized="emit('initialized', $event)"
    />
    <DomainRadioWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
    />
</template>
