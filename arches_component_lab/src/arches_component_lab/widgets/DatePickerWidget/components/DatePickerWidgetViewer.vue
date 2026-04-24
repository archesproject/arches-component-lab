<script setup lang="ts">
import type { DateDatatypeCardXNodeXWidgetData } from "@/arches_component_lab/datatypes/date/types.ts";

defineProps<{
    nodeValue: string | null;
    cardXNodeXWidgetData: DateDatatypeCardXNodeXWidgetData;
}>();
</script>

<template>
    <div>{{ nodeValue }}</div>
</template>
