<script setup lang="ts">
import { ref } from "vue";
import { useGettext } from "vue3-gettext";

import InputText from "primevue/inputtext";

import type { URLValue } from "@/arches_component_lab/datatypes/url/types";
import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";

const { $gettext } = useGettext();

const { cardXNodeXWidgetData, aliasedNodeData } = defineProps<{
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    aliasedNodeData: URLValue;
}>();

const url_label = ref(aliasedNodeData?.node_value?.url_label);
const url = ref(aliasedNodeData?.node_value?.url);

const emit = defineEmits<{
    (event: "update:value", updatedValue: URLValue): void;
}>();

function onUpdateURLValue(updatedValue: string | undefined) {
    if (!updatedValue) {
        updatedValue = "";
    }
    url.value = updatedValue;
    const formattedValue = {
        url: url.value,
        url_label: url_label.value,
    };
    emit("update:value", {
        display_value: JSON.stringify(formattedValue),
        node_value: formattedValue,
        details: [],
    });
}

function onUpdateURLLabelValue(updatedValue: string | undefined) {
    if (!updatedValue) {
        updatedValue = "";
    }
    url_label.value = updatedValue;
    const formattedValue = {
        url: url.value,
        url_label: url_label.value,
    };
    emit("update:value", {
        display_value: JSON.stringify(formattedValue),
        node_value: formattedValue,
        details: [],
    });
}
</script>

<template>
    <div>url label</div>
    <InputText
        type="text"
        :fluid="true"
        :model-value="url_label"
        :placeholder="$gettext('Enter URL Label...')"
        @update:model-value="onUpdateURLLabelValue($event)"
    />
    <div>url</div>
    <InputText
        type="text"
        :fluid="true"
        :model-value="url"
        :placeholder="$gettext('Enter URL...')"
        @update:model-value="onUpdateURLValue($event)"
    />
    <div>preview</div>
    <a
        v-if="aliasedNodeData.node_value.url"
        :href="aliasedNodeData.node_value.url"
    >
        {{ aliasedNodeData.node_value.url_label || aliasedNodeData.node_value.url }}
    </a>
</template>
