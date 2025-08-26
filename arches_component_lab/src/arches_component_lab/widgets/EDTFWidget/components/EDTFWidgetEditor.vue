<script setup lang="ts">
import { ref } from 'vue';
import InputText from "primevue/inputtext";
import Button from 'primevue/button';
import Drawer from 'primevue/drawer';

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { EdtfValue } from "@/arches_component_lab/datatypes/edtf/types";

//const text = ref('');
const visible = ref(false); // IMPORTANT: This must be a ref

const { cardXNodeXWidgetData, aliasedNodeData } = defineProps<{
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    aliasedNodeData: EdtfValue;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: EdtfValue): void;
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
        :model-value="aliasedNodeData.node_value || ''"
        :placeholder="cardXNodeXWidgetData.config.placeholder"
        :pt="{ root: { id: cardXNodeXWidgetData.node.alias } }"
        @update:model-value="onUpdateModelValue($event)"
        />
        <Button class="p-button-text custom-text-button" label="EDTF Formatting" @click="visible = true" />
        <Drawer v-model:visible="visible" position="right" style="height: 100%; width: 50rem" :modal="true" :dissmissable="true">
            <h4>Extended Date/Time Formats (EDTF)</h4>
            <p>The EDTF datatype allows you to describe dates (even uncertain dates). You can find a summary of the standard here: EDTF Date Specfication (Library of Congress)</p>
            <p>Some common encodings:</p>
            <p><b>2021-04-12</b> [year][“-”][month][“-”][day]</p>
            <p>Refers to the calendar date 2021 April 12th with day precision</p>
            <p><b>2021-04</b> [year][“-”][month]</p>
            <p>Refers to the calendar month April 2021 with month precision</p>
            <p><b>2021</b> [year]</p>
            <p>Refers to the year 2021 with year precision</p>
            <p><b>1964/2008</b></p>
            <p>A time interval with calendar year precision, beginning sometime in 1964 and ending sometime in 2008</p>
            <p><b>2004-06/2006-08</b></p>
            <p>A time interval with calendar month precision, beginning sometime in June 2004 and ending sometime in August of 2006</p>
            <p><b>2004-02-01/2005</b></p>
            <p>A time interval with calendar year precision, beginning sometime in 1964 and ending sometime in 2008</p>
            <p><b>Y-100000</b></p>
            <p>The year -100000. 'Y' may be used at the beginning of the date string to signify that the date is a year, when (and only when) the year exceeds four digits, i.e. for years later than 9999 or earlier than -9999.</p>
            <p><b>2001-21</b></p>
            <p>Spring, 2001. The values 21, 22, 23, 24 may be used used to signify ' Spring', 'Summer', 'Autumn', 'Winter', respectively, in place of a month value (01 through 12) for a year-and-month format string</p>
            <p><b>1984?</b></p>
            <p>Year uncertain (possibly the year 1984, but not definitely)</p>
            <p><b>2004-06~</b></p>
            <p><b>2004-06-11%</b></p>
            <p>Entire date (year-month-day) uncertain and approximate</p>
        </Drawer>
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
  font-weight: bold;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0rem 2rem;
  white-space: nowrap;
}
</style>
