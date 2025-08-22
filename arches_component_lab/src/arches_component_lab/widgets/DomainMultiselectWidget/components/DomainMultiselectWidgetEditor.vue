<script setup lang="ts">
import { ref } from "vue";

import MultiSelect from "primevue/multiselect";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { DomainValueList, DomainOption } from "@/arches_component_lab/datatypes/domain/types.ts";

const props = defineProps<{
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    nodeAlias: string;
    aliasedNodeData: DomainValueList;
}>();
console.log(props.aliasedNodeData);
const options = ref<DomainOption>(props.cardXNodeXWidgetData.node.config.options);

const emit = defineEmits<{
    (event: "update:value", updatedValue: DomainValueList): void;
}>();

function onUpdateModelValue(updatedValue: string | undefined) {
    if (updatedValue === undefined) {
        updatedValue = "";
    }

    emit("update:value", {
        display_value: updatedValue,
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
        :model-value="aliasedNodeData.node_value"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
