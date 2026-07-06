<script setup lang="ts">
import { computed } from "vue";

import ConceptMultiSelectWidgetEditor from "@/arches_component_lab/widgets/ConceptMultiselectWidget/components/ConceptMultiselectWidgetEditor.vue";
import ConceptMultiSelectWidgetViewer from "@/arches_component_lab/widgets/ConceptMultiselectWidget/components/ConceptMultiselectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { ConceptListAliasedNodeData } from "@/arches_component_lab/datatypes/concept-list/types.ts";
import type { ConceptMultiselectWidgetProps } from "./types.ts";

const { aliasedNodeData, value } = defineProps<ConceptMultiselectWidgetProps>();

const emit = defineEmits<{
    "update:isLoading": [isLoading: boolean];
    "update:value": [updatedValue: string[] | null];
    "update:aliasedNodeData": [updatedValue: ConceptListAliasedNodeData];
    initialized: [updatedValue: ConceptListAliasedNodeData];
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
    <ConceptMultiSelectWidgetEditor
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
    <ConceptMultiSelectWidgetViewer
        v-if="mode === VIEW"
        :value="resolvedNodeValue"
        :aliased-node-data="aliasedNodeData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
    />
</template>
