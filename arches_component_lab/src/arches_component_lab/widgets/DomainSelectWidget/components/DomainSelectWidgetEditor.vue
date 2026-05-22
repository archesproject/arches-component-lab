<script setup lang="ts">
import Select from "primevue/select";

import { buildDomainAliasedNodeData } from "@/arches_component_lab/datatypes/domain/utils.ts";

import type {
    DomainAliasedNodeData,
    DomainDatatypeCardXNodeXWidgetData,
} from "@/arches_component_lab/datatypes/domain/types.ts";

const { value, cardXNodeXWidgetData } = defineProps<{
    cardXNodeXWidgetData?: DomainDatatypeCardXNodeXWidgetData;
    value: string | null;
}>();

const options = cardXNodeXWidgetData?.node.config.options ?? [];

const emit = defineEmits<{
    (event: "update:value", updatedValue: string | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: DomainAliasedNodeData,
    ): void;
}>();

function onUpdateModelValue(updatedValue: string | null) {
    emit("update:value", updatedValue);
    emit(
        "update:aliasedNodeData",
        buildDomainAliasedNodeData(updatedValue, options),
    );
}
</script>

<template>
    <Select
        option-value="id"
        option-label="text"
        :input-id="cardXNodeXWidgetData?.node.alias"
        :options="options"
        :placeholder="cardXNodeXWidgetData?.config.placeholder"
        :fluid="true"
        :show-clear="true"
        :model-value="value"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
