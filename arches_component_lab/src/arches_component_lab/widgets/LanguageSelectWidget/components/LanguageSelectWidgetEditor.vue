<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";

import Select from "primevue/select";

import { fetchLanguages } from "@/arches_component_lab/widgets/api.ts";

import type { Ref } from "vue";
import type {
    CardXNodeXWidgetData,
    Language,
} from "@/arches_component_lab/types.ts";

const { nodeValue, cardXNodeXWidgetData } = defineProps<{
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    nodeValue: string | null;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: string | null): void;
    (event: "update:isLoading", isLoading: boolean): void;
}>();

const languages: Ref<Language[] | null> = ref<Language[] | null>(null);
const isLoading = ref(false);

watch(isLoading, (newValue) => {
    emit("update:isLoading", newValue);
});

watchEffect(async () => {
    isLoading.value = true;
    try {
        const response = (await fetchLanguages()) as {
            languages: Language[];
            request_language: string;
        };

        languages.value = response.languages;
    } finally {
        isLoading.value = false;
    }
});

function onUpdateModelValue(updatedValue: string | null) {
    emit("update:value", updatedValue);
}
</script>

<template>
    <Select
        option-value="code"
        option-label="name"
        :loading="isLoading"
        :options="languages as Language[]"
        :placeholder="cardXNodeXWidgetData.config.placeholder"
        :fluid="true"
        :model-value="nodeValue"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
