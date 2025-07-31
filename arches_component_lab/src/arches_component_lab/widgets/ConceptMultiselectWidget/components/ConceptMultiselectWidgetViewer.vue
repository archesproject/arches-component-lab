<script setup lang="ts">
import type { ConceptListValue } from "@/arches_component_lab/datatypes/concept/types.ts";
import { computed } from "vue";

const props = defineProps<{
    value?: string | ConceptListValue | null;
}>();

const dataValue = computed(() =>
    !props.value
        ? { display_value: "Unknown", node_value: ["Unknown"] }
        : typeof props.value === "string"
          ? { display_value: props.value, node_value: [props.value] }
          : (props.value as ConceptListValue),
);
</script>
<template>
    <div style="background-color: blue">{[ props.value }}</div>
    <div style="background-color: blue">{[ dataValue }}</div>
    <div :key="dataValue.node_value.join(',')">
        {{ dataValue.display_value }}
    </div>
</template>
