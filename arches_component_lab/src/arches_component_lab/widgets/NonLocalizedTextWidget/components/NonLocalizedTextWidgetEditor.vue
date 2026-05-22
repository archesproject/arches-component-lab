<script setup lang="ts">
import InputText from "primevue/inputtext";

import { buildNonLocalizedTextAliasedNodeData } from "@/arches_component_lab/datatypes/non-localized-text/utils.ts";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { NonLocalizedTextAliasedNodeData } from "@/arches_component_lab/datatypes/non-localized-text/types.ts";

const { cardXNodeXWidgetData, value } = defineProps<{
    cardXNodeXWidgetData?: CardXNodeXWidgetData;
    value: string | null;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: string | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: NonLocalizedTextAliasedNodeData,
    ): void;
}>();

function onUpdateModelValue(updatedValue: string | undefined) {
    const newValue = updatedValue ?? null;
    emit("update:value", newValue);
    emit(
        "update:aliasedNodeData",
        buildNonLocalizedTextAliasedNodeData(newValue),
    );
}
</script>

<template>
    <InputText
        type="text"
        :fluid="true"
        :model-value="value ?? ''"
        :placeholder="cardXNodeXWidgetData?.config.placeholder"
        :pt="{ root: { id: cardXNodeXWidgetData?.node.alias } }"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
