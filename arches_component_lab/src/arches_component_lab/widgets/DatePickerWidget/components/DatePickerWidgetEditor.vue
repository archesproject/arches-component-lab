<script setup lang="ts">
import { debounce } from "es-toolkit/function";

import { computed, ref, watchEffect } from "vue";

import {
    convertISO8601DatetimeFormatToPrimevueDatetimeFormat,
    convertViewMode,
} from "@/arches_component_lab/widgets/DatePickerWidget/utils.ts";

import DatePicker from "primevue/datepicker";

import { formatDate } from "@/arches_component_lab/datatypes/date/utils.ts";

import type { DateDatatypeCardXNodeXWidgetData } from "@/arches_component_lab/datatypes/date/types.ts";

const { cardXNodeXWidgetData, nodeValue } = defineProps<{
    cardXNodeXWidgetData: DateDatatypeCardXNodeXWidgetData;
    nodeValue: string | null;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: string | null): void;
}>();

const shouldShowTime = ref(false);
const dateFormat = ref();
const viewMode = computed(() => {
    return convertViewMode(cardXNodeXWidgetData?.config?.viewMode ?? "days");
});

watchEffect(() => {
    const convertedDateFormat =
        convertISO8601DatetimeFormatToPrimevueDatetimeFormat(
            cardXNodeXWidgetData.node.config.dateFormat,
        );

    dateFormat.value = convertedDateFormat.dateFormat;
    shouldShowTime.value = convertedDateFormat.shouldShowTime;
});

const onUpdateModelValue = debounce((updatedValue: string) => {
    if (!updatedValue) {
        emit("update:value", null);
        return;
    }

    const date = new Date(updatedValue);

    try {
        const formattedDate = formatDate(
            date,
            cardXNodeXWidgetData.node.config.dateFormat,
        );
        emit("update:value", formattedDate);
    } catch (_error) {
        emit("update:value", updatedValue);
    }
}, 900);

const modelDate = computed(() => {
    if (!nodeValue) {
        return null;
    }
    if (shouldShowTime.value) {
        return new Date(nodeValue);
    }
    const incomingDate = new Date(nodeValue);
    const day = incomingDate.getUTCDate();
    const month = incomingDate.getUTCMonth();
    const year = incomingDate.getUTCFullYear();
    return new Date(year, month, day);
});
</script>

<template>
    <DatePicker
        icon-display="input"
        :date-format="dateFormat"
        :fluid="true"
        :input-id="cardXNodeXWidgetData.node.alias"
        :manual-input="true"
        :show-clear="true"
        :model-value="modelDate"
        :show-time="shouldShowTime"
        :show-seconds="shouldShowTime"
        :show-icon="true"
        :view="viewMode"
        @update:model-value="onUpdateModelValue($event as unknown as string)"
    />
</template>
