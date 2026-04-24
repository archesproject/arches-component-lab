<script setup lang="ts">
import InputNumber from "primevue/inputnumber";

import type { NumberCardXNodeXWidgetData } from "@/arches_component_lab/datatypes/number/types.ts";

const { cardXNodeXWidgetData, nodeValue } = defineProps<{
    cardXNodeXWidgetData: NumberCardXNodeXWidgetData;
    nodeValue: number | null;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: number | null): void;
}>();

function onUpdateModelValue(updatedValue: number | null) {
    emit("update:value", updatedValue);
}
</script>

<template>
    <InputNumber
        :model-value="nodeValue"
        :fluid="true"
        :input-id="cardXNodeXWidgetData.node.alias"
        :placeholder="cardXNodeXWidgetData.config.placeholder"
        :prefix="cardXNodeXWidgetData.config.prefix ?? ''"
        :suffix="cardXNodeXWidgetData.config.suffix ?? ''"
        :min-fraction-digits="
            Number(cardXNodeXWidgetData.config.precision) || 0
        "
        :max-fraction-digits="
            Number(cardXNodeXWidgetData.config.precision) || 0
        "
        :min="Number(cardXNodeXWidgetData.config.min) || -Infinity"
        :max="Number(cardXNodeXWidgetData.config.max) || Infinity"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
