<script setup lang="ts">
import { onMounted } from "vue";

import type { PropType } from "vue";
import type { NumberAliasedNodeData } from "@/arches_component_lab/datatypes/number/types.ts";

interface NumberWidgetViewerProps {
    aliasedNodeData: NumberAliasedNodeData;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<NumberWidgetViewerProps["aliasedNodeData"]>,
        required: true,
    },
});

interface NumberWidgetViewerEmits {
    (event: "initialized", updatedValue: NumberAliasedNodeData): void;
}

const emit: NumberWidgetViewerEmits = defineEmits(["initialized"]);

onMounted(() => {
    emit("initialized", aliasedNodeData);
});
</script>

<template>
    <div>{{ aliasedNodeData?.display_value }}</div>
</template>
