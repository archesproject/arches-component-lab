<script setup lang="ts">
import { computed } from "vue";
import { useGettext } from "vue3-gettext";

import type { LanguageValue } from "@/arches_component_lab/datatypes/string/types";

const { nodeValue } = defineProps<{
    nodeValue: Record<string, LanguageValue> | null;
}>();

const { current } = useGettext();

const displayValue = computed(() => {
    if (!nodeValue) return null;
    return (
        nodeValue[current]?.value ?? Object.values(nodeValue)[0]?.value ?? null
    );
});
</script>

<template>
    <div>{{ displayValue }}</div>
</template>
