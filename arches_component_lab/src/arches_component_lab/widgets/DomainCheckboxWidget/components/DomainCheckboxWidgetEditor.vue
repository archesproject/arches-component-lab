<script setup lang="ts">
import Checkbox from "primevue/checkbox";
import CheckboxGroup from "primevue/checkboxgroup";

import type { DomainDatatypeCardXNodeXWidgetData } from "@/arches_component_lab/datatypes/domain/types.ts";

const { nodeValue, cardXNodeXWidgetData } = defineProps<{
    cardXNodeXWidgetData: DomainDatatypeCardXNodeXWidgetData;
    nodeValue: string[] | null;
}>();

const options = cardXNodeXWidgetData.node.config.options;

const emit = defineEmits<{
    (event: "update:value", updatedValue: string[] | null): void;
}>();

function onUpdateModelValue(updatedValue: string[] | null) {
    emit("update:value", updatedValue?.length ? updatedValue : null);
}
</script>

<template>
    <CheckboxGroup
        :model-value="nodeValue ?? []"
        class="button-group"
        @update:model-value="onUpdateModelValue($event)"
    >
        <div
            v-for="option of options"
            :key="option.id"
            class="button-group"
        >
            <Checkbox
                :input-id="option.id"
                :value="option.id"
            />
            <label :for="option.id">{{ option.text }}</label>
        </div>
    </CheckboxGroup>
</template>
<style scoped>
.button-group {
    display: flex;
    flex-direction: row;
    column-gap: 1.5rem;
    row-gap: 0.5rem;
    flex-wrap: wrap;
}
.checkbox-options {
    display: flex;
    gap: 0.25rem;
    align-items: center;
}
</style>
