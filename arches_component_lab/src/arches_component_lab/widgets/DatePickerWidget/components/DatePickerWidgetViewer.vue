<script setup lang="ts">
import type { DateDatatypeCardXNodeXWidgetData } from "@/arches_component_lab/datatypes/date/types.ts";

const { value } = defineProps<{
    value: string | null;
    cardXNodeXWidgetData?: DateDatatypeCardXNodeXWidgetData;
}>();
</script>

<template>
    <div>{{ value }}</div>
</template>
