<script setup lang="ts">
import { computed } from "vue";

import DomainCheckboxWidgetEditor from "@/arches_component_lab/widgets/DomainCheckboxWidget/components/DomainCheckboxWidgetEditor.vue";
import DomainCheckboxWidgetViewer from "@/arches_component_lab/widgets/DomainCheckboxWidget/components/DomainCheckboxWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { DomainListAliasedNodeData } from "@/arches_component_lab/datatypes/domain/types.ts";
import type { DomainCheckboxWidgetProps } from "./types.ts";

const { aliasedNodeData, value } = defineProps<DomainCheckboxWidgetProps>();

const emit = defineEmits<{
    "update:value": [updatedValue: string[] | null];
    "update:aliasedNodeData": [updatedValue: DomainListAliasedNodeData];
    initialized: [updatedValue: DomainListAliasedNodeData];
}>();

// aliasedNodeData !== undefined means the caller passed it (even if null);
// undefined means the prop was omitted, so fall back to the raw value.
const resolvedNodeValue = computed<string[] | null>(() => {
    if (aliasedNodeData !== undefined) {
        return aliasedNodeData?.node_value ?? null;
    }
    return value ?? null;
});
</script>

<template>
    <DomainCheckboxWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
        @initialized="emit('initialized', $event)"
    />
    <DomainCheckboxWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
    />
</template>
