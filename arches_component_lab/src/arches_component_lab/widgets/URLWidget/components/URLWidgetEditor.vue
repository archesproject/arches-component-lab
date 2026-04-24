<script setup lang="ts">
import { ref } from "vue";
import { useGettext } from "vue3-gettext";

import InputText from "primevue/inputtext";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { URLNodeValue } from "@/arches_component_lab/datatypes/url/types";

const { $gettext } = useGettext();

const { cardXNodeXWidgetData, nodeValue } = defineProps<{
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    nodeValue: URLNodeValue | null;
}>();

const urlLabel = ref(nodeValue?.url_label ?? "");
const url = ref(nodeValue?.url ?? "");

const emit = defineEmits<{
    (event: "update:value", updatedValue: URLNodeValue): void;
}>();

function onUpdateURLValue(updatedValue: string | undefined) {
    url.value = updatedValue ?? "";
    updateValue();
}

function onUpdateURLLabelValue(updatedValue: string | undefined) {
    urlLabel.value = updatedValue ?? "";
    updateValue();
}

function updateValue() {
    emit("update:value", {
        url: url.value,
        url_label: urlLabel.value,
    });
}
</script>

<template>
    <div>{{ $gettext("URL Label") }}</div>
    <InputText
        type="text"
        :fluid="true"
        :model-value="urlLabel"
        :placeholder="$gettext('Enter URL Label...')"
        @update:model-value="onUpdateURLLabelValue($event)"
    />
    <div>{{ $gettext("URL") }}</div>
    <InputText
        type="text"
        required="true"
        :fluid="true"
        :model-value="url"
        :pt="{ root: { id: cardXNodeXWidgetData.node.alias } }"
        :placeholder="$gettext('Enter URL...')"
        @update:model-value="onUpdateURLValue($event)"
    />
    <div>{{ $gettext("Preview") }}</div>
    <div>
        <a
            v-if="url"
            :href="url"
            tabindex="-1"
            target="_blank"
            rel="noopener noreferrer"
            >{{ urlLabel || url }}</a
        >
        <span v-else>{{ urlLabel }}</span>
    </div>
</template>
