<script setup lang="ts">
import type { 
    NumberValue
 } from "@/arches_component_lab/datatypes/number/types";

const { aliasedNodeData, cardXNodeXWidgetData } = defineProps<{
    aliasedNodeData: NumberValue | undefined;
}>();
</script>

<template>
    <div>{{ aliasedNodeData.display_value }}</div>
</template>
