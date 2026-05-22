<script setup lang="ts">
import { computed } from "vue";

import { useGettext } from "vue3-gettext";
import DOMPurify from "dompurify";

import type {
    LanguageValue,
    StringAliasedNodeData,
} from "@/arches_component_lab/datatypes/string/types.ts";

const { value, aliasedNodeData } = defineProps<{
    value?: Record<string, LanguageValue> | null;
    aliasedNodeData?: StringAliasedNodeData | null;
}>();

const { current } = useGettext();

const rawHtml = computed(() => {
    if (aliasedNodeData?.display_value) {
        return aliasedNodeData.display_value;
    }
    if (!value) {
        return "";
    }
    return value[current]?.value ?? "";
});

const cleanHtml = computed(() =>
    DOMPurify.sanitize(rawHtml.value, { USE_PROFILES: { html: true } }),
);
</script>

<template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="cleanHtml"></div>
</template>
