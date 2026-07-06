<script setup lang="ts">
import { onMounted } from "vue";
import RadioButton from "primevue/radiobutton";
import RadioButtonGroup from "primevue/radiobuttongroup";

import { buildDomainAliasedNodeData } from "@/arches_component_lab/datatypes/domain/utils.ts";

import type {
    DomainAliasedNodeData,
    DomainCardXNodeXWidgetData,
} from "@/arches_component_lab/datatypes/domain/types.ts";

const { value, cardXNodeXWidgetData } = defineProps<{
    cardXNodeXWidgetData?: DomainCardXNodeXWidgetData;
    value: string | null;
}>();

const options = cardXNodeXWidgetData?.node.config.options ?? [];

const emit = defineEmits<{
    (event: "update:value", updatedValue: string | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: DomainAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: DomainAliasedNodeData): void;
}>();

onMounted(() => {
    emit("initialized", buildDomainAliasedNodeData(value, options));
});

function onUpdateModelValue(updatedValue: string | null) {
    emit("update:value", updatedValue);
    emit(
        "update:aliasedNodeData",
        buildDomainAliasedNodeData(updatedValue, options),
    );
}
</script>

<template>
    <RadioButtonGroup
        :id="cardXNodeXWidgetData?.node.alias"
        :model-value="value"
        class="button-group"
        tabindex="-1"
        @update:model-value="onUpdateModelValue($event)"
    >
        <div
            v-for="option in options"
            :key="option.id"
            class="radio-options"
        >
            <RadioButton
                :input-id="option.id"
                :value="option.id"
                size="small"
            />
            <label :for="option.id">{{ option.text }}</label>
        </div>
    </RadioButtonGroup>
</template>
<style scoped>
.button-group {
    display: flex;
    flex-direction: row;
    column-gap: 1.5rem;
    row-gap: 0.5rem;
    flex-wrap: wrap;
}
.radio-options {
    display: flex;
    gap: 0.25rem;
    align-items: center;
}
</style>
