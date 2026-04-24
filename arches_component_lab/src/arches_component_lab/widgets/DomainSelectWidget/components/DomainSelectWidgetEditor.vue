<script setup lang="ts">
import Select from "primevue/select";

import type {
    DomainDatatypeCardXNodeXWidgetData,
    DomainOption,
} from "@/arches_component_lab/datatypes/domain/types.ts";

const { nodeValue, cardXNodeXWidgetData } = defineProps<{
    cardXNodeXWidgetData: DomainDatatypeCardXNodeXWidgetData;
    nodeValue: string | null;
}>();

const options = cardXNodeXWidgetData.node.config.options;

const emit = defineEmits<{
    (event: "update:value", updatedValue: string | null): void;
}>();

function onUpdateModelValue(updatedValue: string | null) {
    emit("update:value", updatedValue);
}
</script>

<template>
    <Select
        option-value="id"
        option-label="text"
        :options="options"
        :placeholder="cardXNodeXWidgetData.config.placeholder"
        :fluid="true"
        :show-clear="true"
        :model-value="nodeValue"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
