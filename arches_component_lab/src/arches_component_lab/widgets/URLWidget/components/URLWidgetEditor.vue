<script setup lang="ts">
import { ref } from "vue";
import { useGettext } from "vue3-gettext";

import InputText from "primevue/inputtext";

import type { URLValue } from "@/arches_component_lab/datatypes/url/types";
import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";

const { $gettext } = useGettext();

const { cardXNodeXWidgetData, value } = defineProps<{
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    value: URLValue;
}>();

const url_label = ref(value?.node_value?.url_label || "");
const url = ref(value?.node_value?.url || "");

const emit = defineEmits<{
    (event: "update:value", updatedValue: URLValue): void;
}>();

function onUpdateModelValue(updatedValue: string | undefined) {
    const formattedValue = {
        url: updatedValue ?? "",
        url_label: updatedValue ?? "",
    };
    emit("update:value", {
        display_value: JSON.stringify(formattedValue),
        node_value: formattedValue,
        details: [],
    });
}
</script>

<template>
    <InputText
        type="text"
        :fluid="true"
        :model-value="value.node_value?.url ?? ''"
        :pt="{ root: { id: cardXNodeXWidgetData.node.alias } }"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
