<script setup lang="ts">
import { computed } from "vue";

import NodeValueSelectWidgetEditor from "@/arches_component_lab/widgets/NodeValueSelectWidget/components/NodeValueSelectWidgetEditor.vue";
import NodeValueSelectWidgetViewer from "@/arches_component_lab/widgets/NodeValueSelectWidget/components/NodeValueSelectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";
import { buildNodeValueAliasedNodeData } from "@/arches_component_lab/datatypes/node-value/utils.ts";

import type { PropType } from "vue";
import type { NodeValueAliasedNodeData } from "@/arches_component_lab/datatypes/node-value/types.ts";
import type { NodeValueSelectWidgetProps } from "@/arches_component_lab/widgets/NodeValueSelectWidget/types.ts";

const { aliasedNodeData, value } = defineProps({
    mode: {
        type: String as PropType<NodeValueSelectWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<NodeValueSelectWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<NodeValueSelectWidgetProps["graphSlug"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<
            NodeValueSelectWidgetProps["cardXNodeXWidgetData"]
        >,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<NodeValueSelectWidgetProps["aliasedNodeData"]>,
        default: undefined,
    },
    value: {
        type: String as PropType<NodeValueSelectWidgetProps["value"]>,
        default: undefined,
    },
});

interface NodeValueSelectWidgetEmits {
    (event: "update:value", updatedValue: string | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: NodeValueAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: NodeValueAliasedNodeData): void;
}

const emit: NodeValueSelectWidgetEmits = defineEmits([
    "update:value",
    "update:aliasedNodeData",
    "initialized",
]);

const resolvedAliasedNodeData = computed(
    () => aliasedNodeData ?? buildNodeValueAliasedNodeData(value ?? null),
);

function onUpdateAliasedNodeData(
    updatedAliasedNodeData: NodeValueAliasedNodeData,
) {
    emit("update:aliasedNodeData", updatedAliasedNodeData);
    emit("update:value", updatedAliasedNodeData.node_value);
}
</script>

<template>
    <NodeValueSelectWidgetEditor
        v-if="mode === EDIT"
        :aliased-node-data="resolvedAliasedNodeData"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <NodeValueSelectWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
