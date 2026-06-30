<script setup lang="ts">
import { onMounted } from "vue";
import ToggleSwitch from "primevue/toggleswitch";

import { buildBooleanAliasedNodeData } from "@/arches_component_lab/datatypes/boolean/utils.ts";

import type { BooleanCardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { BooleanAliasedNodeData } from "@/arches_component_lab/datatypes/boolean/types.ts";

const { cardXNodeXWidgetData, value } = defineProps<{
    cardXNodeXWidgetData?: BooleanCardXNodeXWidgetData;
    value: boolean | null;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: boolean | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: BooleanAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: BooleanAliasedNodeData): void;
}>();

onMounted(() => {
    emit("initialized", buildBooleanAliasedNodeData(value));
});

function onUpdateModelValue(updatedValue: boolean | null) {
    emit("update:value", updatedValue);
    emit("update:aliasedNodeData", buildBooleanAliasedNodeData(updatedValue));
}
</script>

<template>
    <ToggleSwitch
        :fluid="true"
        :input-id="cardXNodeXWidgetData?.node.alias"
        :model-value="value ?? false"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
