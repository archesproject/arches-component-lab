<script setup lang="ts">
import { ref } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

import EDTFHelpDrawer from "@/arches_component_lab/widgets/EDTFWidget/components/EDTFWidgetEditor/components/ETDFHelpDrawer.vue"

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { EDTFValue } from "@/arches_component_lab/datatypes/edtf/types";

const visible = ref(false);

const { cardXNodeXWidgetData, aliasedNodeData } = defineProps<{
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    aliasedNodeData: EDTFValue;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: EDTFValue): void;
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
    <div class="field-with-button">
        <InputText
            class="flex-input"
            type="text"
            :fluid="true"
            :model-value="aliasedNodeData.node_value"
            :placeholder="cardXNodeXWidgetData.config.placeholder"
            :pt="{ root: { id: cardXNodeXWidgetData.node.alias } }"
            @update:model-value="onUpdateModelValue($event)"
        />
        <Button
            class="p-button-text custom-text-button"
            label="EDTF Formatting"
            @click="visible = true"
        />
        <EDTFHelpDrawer v-model:visible="visible"/>
    </div>
</template>

<style scoped>
.field-with-button {
    display: flex;
    align-items: center;
    gap: 0.5rem; /* space between input and button */
    width: 100%;
}

.flex-input {
    flex: 1 1 auto;
    min-width: 0;
}

.custom-text-button {
    padding: 0rem 1rem;
}
</style>
