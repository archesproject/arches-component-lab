<script setup lang="ts">
import { computed } from "vue";

import NodeValueSelectWidgetEditor from "@/arches_component_lab/widgets/NodeValueSelectWidget/components/NodeValueSelectWidgetEditor.vue";
import NodeValueSelectWidgetViewer from "@/arches_component_lab/widgets/NodeValueSelectWidget/components/NodeValueSelectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { NodeValueAliasedNodeData } from "@/arches_component_lab/datatypes/node-value/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

const { aliasedNodeData, value } = defineProps<{
    mode: WidgetMode;
    nodeAlias?: string;
    graphSlug?: string;
    cardXNodeXWidgetData?: CardXNodeXWidgetData;
    aliasedNodeData?: NodeValueAliasedNodeData | null;
    value?: string | null;
}>();

const emit = defineEmits<{
    "update:value": [updatedValue: string];
    "update:aliasedNodeData": [updatedValue: NodeValueAliasedNodeData];
    initialized: [updatedValue: NodeValueAliasedNodeData];
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
    <NodeValueSelectWidgetEditor
        v-if="mode === EDIT"
        :value="resolvedNodeValue"
        @update:value="emit('update:value', $event)"
        @initialized="emit('initialized', $event)"
    />
    <NodeValueSelectWidgetViewer
        v-if="mode === VIEW"
        :value="resolvedNodeValue"
    />
</template>
