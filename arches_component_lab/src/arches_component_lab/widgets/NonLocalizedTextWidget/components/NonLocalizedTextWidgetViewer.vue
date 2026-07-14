<script setup lang="ts">
import { onMounted } from "vue";

import type { PropType } from "vue";
import type { NonLocalizedTextAliasedNodeData } from "@/arches_component_lab/datatypes/non-localized-text/types.ts";

interface NonLocalizedTextWidgetViewerProps {
    aliasedNodeData: NonLocalizedTextAliasedNodeData;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<
            NonLocalizedTextWidgetViewerProps["aliasedNodeData"]
        >,
        required: true,
    },
});

interface NonLocalizedTextWidgetViewerEmits {
    (event: "initialized", updatedValue: NonLocalizedTextAliasedNodeData): void;
}

const emit: NonLocalizedTextWidgetViewerEmits = defineEmits(["initialized"]);

onMounted(() => {
    emit("initialized", aliasedNodeData);
});
</script>

<template>
    <div>{{ aliasedNodeData?.display_value }}</div>
</template>
