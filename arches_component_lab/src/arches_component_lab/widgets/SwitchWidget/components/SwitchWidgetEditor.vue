<script setup lang="ts">
import ToggleSwitch from "primevue/toggleswitch";

import type { BooleanCardXNodeXWidgetData } from "@/arches_component_lab/types.ts";

const { cardXNodeXWidgetData, value } = defineProps<{
    cardXNodeXWidgetData: BooleanCardXNodeXWidgetData;
    value: boolean | null;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: boolean | null): void;
}>();

function onUpdateModelValue(updatedValue: boolean | null) {
    emit("update:value", updatedValue);
}
</script>

<template>
    <ToggleSwitch
        :fluid="true"
        :input-id="cardXNodeXWidgetData.node.alias"
        :model-value="value ?? false"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
