<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";

import { fetchLanguages } from "@/arches_component_lab/widgets/api.ts";

import type { Language } from "@/arches_component_lab/types.ts";

const { value } = defineProps<{ value: string | null }>();

const languages = ref<Language[]>([]);

const displayValue = computed(
    () => languages.value.find((lang) => lang.code === value)?.name ?? value,
);

watchEffect(async () => {
    const response = (await fetchLanguages()) as {
        languages: Language[];
        request_language: string;
    };
    languages.value = response.languages;
});
</script>

<template>
    <div>{{ displayValue }}</div>
</template>
