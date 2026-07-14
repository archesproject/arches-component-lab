<script setup lang="ts">
import { watch } from "vue";

import type { PropType } from "vue";
import type { ConceptAliasedNodeData } from "@/arches_component_lab/datatypes/concept/types.ts";

interface ConceptRadioWidgetViewerProps {
    aliasedNodeData?: ConceptAliasedNodeData | null;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<
            ConceptRadioWidgetViewerProps["aliasedNodeData"]
        >,
        default: undefined,
    },
});

interface ConceptRadioWidgetViewerEmits {
    (event: "initialized", updatedValue: ConceptAliasedNodeData): void;
}

const emit: ConceptRadioWidgetViewerEmits = defineEmits(["initialized"]);

watch(
    () => aliasedNodeData,
    (newValue) => {
        if (newValue) {
            emit("initialized", newValue);
        }
    },
    { immediate: true },
);
</script>

<template>
    <div>{{ aliasedNodeData?.display_value }}</div>
</template>
