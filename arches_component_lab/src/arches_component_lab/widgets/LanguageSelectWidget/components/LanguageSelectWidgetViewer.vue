<script setup lang="ts">
import { watch } from "vue";

import type { PropType } from "vue";
import type { LanguageAliasedNodeData } from "@/arches_component_lab/datatypes/language/types.ts";

interface LanguageSelectWidgetViewerProps {
    aliasedNodeData?: LanguageAliasedNodeData | null;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<
            LanguageSelectWidgetViewerProps["aliasedNodeData"]
        >,
        default: undefined,
    },
});

interface LanguageSelectWidgetViewerEmits {
    (event: "initialized", updatedValue: LanguageAliasedNodeData): void;
}

const emit: LanguageSelectWidgetViewerEmits = defineEmits(["initialized"]);

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
