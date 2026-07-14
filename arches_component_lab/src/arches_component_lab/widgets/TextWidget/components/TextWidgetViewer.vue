<script setup lang="ts">
import { onMounted } from "vue";

import type { PropType } from "vue";
import type { StringAliasedNodeData } from "@/arches_component_lab/datatypes/string/types";

interface TextWidgetViewerProps {
    aliasedNodeData: StringAliasedNodeData;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<TextWidgetViewerProps["aliasedNodeData"]>,
        required: true,
    },
});

interface TextWidgetViewerEmits {
    (event: "initialized", updatedValue: StringAliasedNodeData): void;
}

const emit: TextWidgetViewerEmits = defineEmits(["initialized"]);

onMounted(() => {
    emit("initialized", aliasedNodeData);
});
</script>

<template>
    <div>{{ aliasedNodeData?.display_value }}</div>
</template>
