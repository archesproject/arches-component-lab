<script setup lang="ts">
import type { 
    NumberValue,
    NumberCardXNodeXWidgetData
 } from "@/arches_component_lab/datatypes/number/types";

const { aliasedNodeData, cardXNodeXWidgetData } = defineProps<{
    aliasedNodeData: NumberValue | undefined;
    cardXNodeXWidgetData: NumberCardXNodeXWidgetData;
}>();
</script>

<template>
    <div>{{ aliasedNodeData.display_value }}</div>
</template>
