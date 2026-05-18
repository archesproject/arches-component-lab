<script setup lang="ts">
import { computed } from "vue";
import { useGettext } from "vue3-gettext";
import DOMPurify from "dompurify";

import type { LanguageValue } from "@/arches_component_lab/datatypes/string/types";

const { value } = defineProps<{
    value: Record<string, LanguageValue> | null;
}>();

const { current } = useGettext();

const cleanHtml = computed(() => {
    const raw =
        value?.[current]?.value ?? Object.values(value ?? {})[0]?.value ?? "";
    return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
});
</script>

<template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="cleanHtml"></div>
</template>
