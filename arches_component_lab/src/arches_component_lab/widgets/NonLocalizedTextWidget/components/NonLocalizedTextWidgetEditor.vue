<script setup lang="ts">
import InputText from "primevue/inputtext";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";

const { cardXNodeXWidgetData, value } = defineProps<{
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    value: string | null;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: string | null): void;
}>();

function onUpdateModelValue(updatedValue: string | undefined) {
    emit("update:value", updatedValue ?? null);
}
</script>

<template>
    <InputText
        type="text"
        :fluid="true"
        :model-value="value ?? ''"
        :placeholder="cardXNodeXWidgetData.config.placeholder"
        :pt="{ root: { id: cardXNodeXWidgetData.node.alias } }"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
