<script setup lang="ts">
import { ref } from "vue";

import MultiSelect from "primevue/multiselect";

import type {
    DomainDatatypeCardXNodeXWidgetData,
    DomainValueList,
    DomainOption,
} from "@/arches_component_lab/datatypes/domain/types.ts";

const props = defineProps<{
    cardXNodeXWidgetData: DomainDatatypeCardXNodeXWidgetData;
    nodeAlias: string;
    aliasedNodeData: DomainValueList;
}>();

const options = ref<[DomainOption[]]>(
    props.cardXNodeXWidgetData.node.config.options,
);

const emit = defineEmits<{
    (event: "update:value", updatedValue: DomainValueList): void;
}>();

function onUpdateModelValue(updatedValue: string[] | null) {
    if (updatedValue?.length === 0) {
        updatedValue = null;
    }
    const updatedDisplayValue = updatedValue?.map(
        (domain) =>
            options.value.find(
                (option: DomainOption) => option.id === domain,
            )?.text,
    ).join(", ") || "";

    emit("update:value", {
        display_value: updatedDisplayValue,
        node_value: updatedValue,
        details: [],
    });
}
</script>

<template>
    <MultiSelect
        option-value="id"
        option-label="text"
        :options="options"
        :placeholder="cardXNodeXWidgetData.config.placeholder"
        :fluid="true"
        :model-value="aliasedNodeData.node_value || []"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
