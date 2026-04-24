<script setup lang="ts">
import { computed } from "vue";

import type { FeatureCollection } from "geojson";

const { nodeValue } = defineProps<{ nodeValue: FeatureCollection | null }>();

const displayValue = computed(() => {
    if (!nodeValue) return null;
    const count = nodeValue.features?.length ?? 0;
    return `${count} feature(s)`;
});
</script>

<template>
    <div>{{ displayValue }}</div>
</template>
