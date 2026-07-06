<script setup lang="ts">
import { computed } from "vue";

import ResourceInstanceSelectWidgetEditor from "@/arches_component_lab/widgets/ResourceInstanceSelectWidget/components/ResourceInstanceSelectWidgetEditor.vue";
import ResourceInstanceSelectWidgetViewer from "@/arches_component_lab/widgets/ResourceInstanceSelectWidget/components/ResourceInstanceSelectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type {
    ResourceInstanceAliasedNodeData,
    ResourceInstanceReference,
} from "@/arches_component_lab/datatypes/resource-instance/types";
import type { ResourceInstanceSelectWidgetProps } from "./types.ts";

const {
    aliasedNodeData,
    mode,
    nodeAlias,
    graphSlug,
    cardXNodeXWidgetData,
    value,
    defaultTerm,
} = defineProps<ResourceInstanceSelectWidgetProps>();

const emit = defineEmits<{
    "update:isLoading": [isLoading: boolean];
    "update:value": [updatedValue: ResourceInstanceReference | null];
    "update:aliasedNodeData": [updatedValue: ResourceInstanceAliasedNodeData];
    initialized: [updatedValue: ResourceInstanceAliasedNodeData];
}>();

// aliasedNodeData !== undefined means the caller passed it (even if null);
// undefined means the prop was omitted, so fall back to the raw value.
const resolvedNodeValue = computed<ResourceInstanceReference | null>(() => {
    if (aliasedNodeData !== undefined) {
        return aliasedNodeData?.node_value ?? null;
    }
    return value ?? null;
});
</script>

<template>
    <ResourceInstanceSelectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
        :value="resolvedNodeValue"
        :default-term="defaultTerm"
        @update:is-loading="emit('update:isLoading', $event)"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
        @initialized="emit('initialized', $event)"
    />
    <ResourceInstanceSelectWidgetViewer
        v-if="mode === VIEW"
        :value="resolvedNodeValue"
        :aliased-node-data="aliasedNodeData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
    />
</template>
