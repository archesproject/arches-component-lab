<script setup lang="ts">
import { watch } from "vue";

import type { PropType } from "vue";
import type { ConceptListAliasedNodeData } from "@/arches_component_lab/datatypes/concept-list/types.ts";

interface ConceptMultiselectWidgetViewerProps {
    aliasedNodeData?: ConceptListAliasedNodeData | null;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<
            ConceptMultiselectWidgetViewerProps["aliasedNodeData"]
        >,
        default: undefined,
    },
});

interface ConceptMultiselectWidgetViewerEmits {
    (event: "initialized", updatedValue: ConceptListAliasedNodeData): void;
}

const emit: ConceptMultiselectWidgetViewerEmits = defineEmits(["initialized"]);

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
