<script setup lang="ts">
import { onMounted } from "vue";

import type { PropType } from "vue";
import type { NodeValueAliasedNodeData } from "@/arches_component_lab/datatypes/node-value/types.ts";

interface NodeValueSelectWidgetViewerProps {
    aliasedNodeData: NodeValueAliasedNodeData;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<
            NodeValueSelectWidgetViewerProps["aliasedNodeData"]
        >,
        required: true,
    },
});

interface NodeValueSelectWidgetViewerEmits {
    (event: "initialized", updatedValue: NodeValueAliasedNodeData): void;
}

const emit: NodeValueSelectWidgetViewerEmits = defineEmits(["initialized"]);

onMounted(() => {
    emit("initialized", aliasedNodeData);
});
</script>

<template>
    <div>{{ aliasedNodeData?.display_value }}</div>
</template>
