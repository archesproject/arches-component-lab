<script setup lang="ts">
import { ref } from "vue";

import Select from "primevue/select";

import type {
    DomainDatatypeCardXNodeXWidgetData,
    DomainValue,
    DomainOption,
} from "@/arches_component_lab/datatypes/domain/types.ts";

const props = defineProps<{
    cardXNodeXWidgetData: DomainDatatypeCardXNodeXWidgetData;
    nodeAlias: string;
    aliasedNodeData: DomainValue;
}>();

const options = ref<DomainOption[]>(
    props.cardXNodeXWidgetData.node.config.options,
);

const emit = defineEmits<{
    (event: "update:value", updatedValue: DomainValue): void;
}>();

function onUpdateModelValue(updatedValue: string | null) {
    const updatedDisplayValue = options.value.find(
        (option: DomainOption) => option.id === updatedValue,
    )?.text || "";

    emit("update:value", {
        display_value: updatedDisplayValue,
        node_value: updatedValue,
        details: [],
    });
}
</script>

<template>
    <Select
        option-value="id"
        option-label="text"
        :options="options"
        :placeholder="cardXNodeXWidgetData.config.placeholder"
        :fluid="true"
        :model-value="aliasedNodeData.node_value"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
