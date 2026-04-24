<script setup lang="ts">
import RadioButton from "primevue/radiobutton";
import RadioButtonGroup from "primevue/radiobuttongroup";
import { useGettext } from "vue3-gettext";

import type { BooleanCardXNodeXWidgetData } from "@/arches_component_lab/types.ts";

const { $gettext } = useGettext();

const { cardXNodeXWidgetData, nodeValue } = defineProps<{
    cardXNodeXWidgetData: BooleanCardXNodeXWidgetData;
    nodeValue: boolean | null;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: boolean | null): void;
}>();

function onUpdateModelValue(updatedValue: string | null) {
    let booleanValue: boolean | null;
    switch (updatedValue) {
        case "true":
            booleanValue = true;
            break;
        case "false":
            booleanValue = false;
            break;
        default:
            booleanValue = null;
            break;
    }
    emit("update:value", booleanValue);
}
</script>

<template>
    <RadioButtonGroup
        fluid="true"
        class="button-group"
        :model-value="nodeValue?.toString() ?? ''"
        @update:model-value="onUpdateModelValue($event)"
    >
        <div class="radio-options">
            <RadioButton
                input-id="`${cardXNodeXWidgetData.node.alias}-true`"
                size="small"
                value="true"
            />
            <label for="`${cardXNodeXWidgetData.node.alias}-true`">{{
                cardXNodeXWidgetData.node.config.trueLabel
            }}</label>
        </div>
        <div class="radio-options">
            <RadioButton
                input-id="`${cardXNodeXWidgetData.node.alias}-false`"
                size="small"
                value="false"
            />
            <label for="`${cardXNodeXWidgetData.node.alias}-false`">{{
                cardXNodeXWidgetData.node.config.falseLabel
            }}</label>
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

label {
    all: unset;
}
</style>
