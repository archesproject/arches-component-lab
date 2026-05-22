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

const gettext = useGettext();

const cleanHtml = computed(() => {
    const raw =
        aliasedNodeData?.display_value ??
        value?.[gettext.current]?.value ??
        Object.values(value ?? {})[0]?.value ??
        "";
    return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
});
</script>

<template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="cleanHtml"></div>
</template>
