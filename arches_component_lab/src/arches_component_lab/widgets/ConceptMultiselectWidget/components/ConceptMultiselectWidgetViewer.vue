<script setup lang="ts">
import type { ConceptListValue } from "@/arches_component_lab/datatypes/concept/types.ts";
import { computed } from "vue";

const props = defineProps<{
    value?: ConceptListValue | string[] | null | undefined;
}>();

const dataValue = computed(() =>
    !props.value
        ? { display_value: "Unknown", node_value: ["Unknown"] }
        : Array.isArray( props.value )
          ? { display_value: (props.value as string[]).join(", "), node_value: props.value }
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
