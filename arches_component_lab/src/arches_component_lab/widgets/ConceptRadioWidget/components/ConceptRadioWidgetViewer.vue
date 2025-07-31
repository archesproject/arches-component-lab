<script setup lang="ts">
import type { ConceptValue } from "@/arches_component_lab/datatypes/concept/types.ts";
import { computed } from "vue";

const props = defineProps<{
    value?: string | ConceptValue | null;
}>();

const dataValue = computed(() =>
    !props.value
        ? { display_value: "Unknown", node_value: "Unknown" }
        : typeof props.value === "string"
          ? { display_value: props.value, node_value: props.value }
          : (props.value as ConceptValue),
);
</script>
<template>
    <div :key="dataValue.node_value?.[0]">{{ dataValue.display_value }}</div>
</template>
