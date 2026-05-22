<script setup lang="ts">
import MultiSelect from "primevue/multiselect";

import { buildDomainListAliasedNodeData } from "@/arches_component_lab/datatypes/domain/utils.ts";

import type {
    DomainDatatypeCardXNodeXWidgetData,
    DomainListAliasedNodeData,
} from "@/arches_component_lab/datatypes/domain/types.ts";

const { value, cardXNodeXWidgetData } = defineProps<{
    cardXNodeXWidgetData?: DomainDatatypeCardXNodeXWidgetData;
    value: string[] | null;
}>();

const options = cardXNodeXWidgetData?.node.config.options ?? [];

const emit = defineEmits<{
    (event: "update:value", updatedValue: string[] | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: DomainListAliasedNodeData,
    ): void;
}>();

function onUpdateModelValue(updatedValue: string[] | null) {
    const nodeValues = updatedValue?.length ? updatedValue : null;
    emit("update:value", nodeValues);
    emit(
        "update:aliasedNodeData",
        buildDomainListAliasedNodeData(nodeValues, options),
    );
}
</script>

<template>
    <MultiSelect
        option-value="id"
        option-label="text"
        :input-id="cardXNodeXWidgetData?.node.alias"
        :options="options"
        :placeholder="cardXNodeXWidgetData?.config.placeholder"
        :fluid="true"
        :show-clear="true"
        :model-value="value ?? []"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
