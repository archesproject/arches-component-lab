<script setup lang="ts">
import { computed, onMounted } from "vue";

import DOMPurify from "dompurify";

import type { PropType } from "vue";
import type { StringAliasedNodeData } from "@/arches_component_lab/datatypes/string/types.ts";

interface RichTextWidgetViewerProps {
    aliasedNodeData: StringAliasedNodeData;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<RichTextWidgetViewerProps["aliasedNodeData"]>,
        required: true,
    },
});

interface RichTextWidgetViewerEmits {
    (event: "initialized", updatedValue: StringAliasedNodeData): void;
}

const emit: RichTextWidgetViewerEmits = defineEmits(["initialized"]);

onMounted(() => {
    emit("initialized", aliasedNodeData);
});

const cleanHtml = computed(() =>
    DOMPurify.sanitize(aliasedNodeData?.display_value ?? "", {
        USE_PROFILES: { html: true },
    }),
);
</script>

<template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="cleanHtml"></div>
</template>
