<script setup lang="ts">
import { computed } from "vue";
import { useGettext } from "vue3-gettext";

import type { LanguageValue } from "@/arches_component_lab/datatypes/string/types";

const { value } = defineProps<{
    value: Record<string, LanguageValue> | null;
}>();

const { current } = useGettext();

const displayValue = computed(() => {
    if (!value) return null;
    return value[current]?.value ?? Object.values(value)[0]?.value ?? null;
});
</script>

<template>
    <div>{{ displayValue }}</div>
</template>
