<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";

import { fetchLanguages } from "@/arches_component_lab/widgets/api.ts";

import type { Language } from "@/arches_component_lab/types.ts";

const { nodeValue } = defineProps<{ nodeValue: string | null }>();

const languages = ref<Language[]>([]);

watchEffect(async () => {
    const response = (await fetchLanguages()) as {
        languages: Language[];
        request_language: string;
    };
    languages.value = response.languages;
});

const displayValue = computed(
    () =>
        languages.value.find((lang) => lang.code === nodeValue)?.name ??
        nodeValue,
);
</script>

<template>
    <div>{{ displayValue }}</div>
</template>
