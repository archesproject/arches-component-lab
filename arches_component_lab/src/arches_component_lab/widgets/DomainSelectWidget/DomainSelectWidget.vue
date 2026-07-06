<script setup lang="ts">
import { computed } from "vue";

import DomainSelectWidgetEditor from "@/arches_component_lab/widgets/DomainSelectWidget/components/DomainSelectWidgetEditor.vue";
import DomainSelectWidgetViewer from "@/arches_component_lab/widgets/DomainSelectWidget/components/DomainSelectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { DomainAliasedNodeData } from "@/arches_component_lab/datatypes/domain/types.ts";
import type { DomainSelectWidgetProps } from "./types.ts";

const { aliasedNodeData, value } = defineProps<DomainSelectWidgetProps>();

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
    <DomainSelectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
        @initialized="emit('initialized', $event)"
    />
    <DomainSelectWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
    />
</template>
