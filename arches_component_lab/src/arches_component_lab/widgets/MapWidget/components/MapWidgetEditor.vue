<script setup lang="ts">
import { computed } from "vue";
import InputText from "primevue/inputtext";

import type { FeatureCollection } from "geojson";

const { nodeValue } = defineProps<{ nodeValue: FeatureCollection | null }>();

const displayValue = computed(() => {
    if (!nodeValue) return "";
    const count = nodeValue.features?.length ?? 0;
    return `${count} feature(s)`;
});
</script>

<template>
    <InputText
        disabled
        type="text"
        :fluid="true"
        :model-value="displayValue"
    />
</template>
