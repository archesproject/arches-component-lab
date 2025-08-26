<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';

import type { NumberCardXNodeXWidgetData, NumberValue } from "@/arches_component_lab/datatypes/number/types.ts";

const { cardXNodeXWidgetData, aliasedNodeData } = defineProps<{
  cardXNodeXWidgetData: NumberCardXNodeXWidgetData;
  aliasedNodeData: NumberValue;
}>();

const emit = defineEmits<{
  (event: "update:value", updatedValue: NumberValue): void;
}>();

function onUpdateModelValue(updatedValue: number | null) {
    emit("update:value", {
        display_value: updatedValue ?? null,
        node_value: updatedValue ?? null,
        details: [],
    });
}
</script>

<template>
    <InputNumber 
        :model-value="aliasedNodeData?.node_value ?? null"
        :fluid="true"
        :inputId="cardXNodeXWidgetData.node.alias"
        :placeholder="cardXNodeXWidgetData.config.placeholder"
        :prefix="cardXNodeXWidgetData.config.prefix ?? ''"
        :suffix="cardXNodeXWidgetData.config.suffix ?? ''"
        :minFractionDigits="+cardXNodeXWidgetData.config.precision || 0"
        :maxFractionDigits="+cardXNodeXWidgetData.config.precision || 0"
        :min="cardXNodeXWidgetData.config.min"
        :max="cardXNodeXWidgetData.config.max"
        @update:model-value="onUpdateModelValue($event)"
    />
    <pre>{{ cardXNodeXWidgetData.config }}</pre>
</template>