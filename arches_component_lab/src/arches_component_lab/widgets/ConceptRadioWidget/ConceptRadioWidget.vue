<script setup lang="ts">
import { computed } from "vue";

import ConceptRadioWidgetEditor from "@/arches_component_lab/widgets/ConceptRadioWidget/components/ConceptRadioWidgetEditor.vue";
import ConceptRadioWidgetViewer from "@/arches_component_lab/widgets/ConceptRadioWidget/components/ConceptRadioWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { ConceptAliasedNodeData } from "@/arches_component_lab/datatypes/concept/types.ts";
import type { ConceptRadioWidgetProps } from "./types.ts";

const { aliasedNodeData, value } = defineProps<ConceptRadioWidgetProps>();

const emit = defineEmits<{
    "update:isDirty": [isDirty: boolean];
    "update:isLoading": [isLoading: boolean];
    "update:value": [updatedValue: string | null];
    "update:aliasedNodeData": [updatedValue: ConceptAliasedNodeData];
    initialized: [updatedValue: ConceptAliasedNodeData];
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
    <ConceptRadioWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
        :value="resolvedNodeValue"
        @update:is-loading="emit('update:isLoading', $event)"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
        @initialized="emit('initialized', $event)"
    />
    <ConceptRadioWidgetViewer
        v-if="mode === VIEW"
        :value="resolvedNodeValue"
        :aliased-node-data="aliasedNodeData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
    />
</template>
