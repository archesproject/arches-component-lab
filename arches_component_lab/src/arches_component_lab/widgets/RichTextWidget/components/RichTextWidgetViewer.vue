<script setup lang="ts">
import { computed } from "vue";
import { useGettext } from "vue3-gettext";
import DOMPurify from "dompurify";

import type { LanguageValue } from "@/arches_component_lab/datatypes/string/types";

const { current } = useGettext();

const { nodeValue } = defineProps<{
    nodeValue: Record<string, LanguageValue> | null;
}>();

const cleanHtml = computed(() => {
    const raw =
        nodeValue?.[current]?.value ??
        Object.values(nodeValue ?? {})[0]?.value ??
        "";
    return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
});
</script>

<template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="cleanHtml"></div>
</template>
