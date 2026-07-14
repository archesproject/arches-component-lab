<script setup lang="ts">
import { onMounted } from "vue";

import type { PropType } from "vue";
import type { EDTFAliasedNodeData } from "@/arches_component_lab/datatypes/edtf/types.ts";

interface EDTFWidgetViewerProps {
    aliasedNodeData: EDTFAliasedNodeData;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<EDTFWidgetViewerProps["aliasedNodeData"]>,
        required: true,
    },
});

interface EDTFWidgetViewerEmits {
    (event: "initialized", updatedValue: EDTFAliasedNodeData): void;
}

const emit: EDTFWidgetViewerEmits = defineEmits(["initialized"]);

onMounted(() => {
    emit("initialized", aliasedNodeData);
});
</script>

<template>
    <div>{{ aliasedNodeData?.display_value }}</div>
</template>
