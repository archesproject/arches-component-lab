<script setup lang="ts">
import type { DateCardXNodeXWidgetData } from "@/arches_component_lab/datatypes/date/types.ts";

const { value } = defineProps<{
    value: string | null;
    cardXNodeXWidgetData?: DateCardXNodeXWidgetData;
}>();
</script>

<template>
    <div>{{ value }}</div>
</template>
