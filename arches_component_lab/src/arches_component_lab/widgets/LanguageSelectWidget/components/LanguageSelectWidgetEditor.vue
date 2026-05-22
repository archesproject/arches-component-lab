<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";

import Select from "primevue/select";

import { fetchLanguages } from "@/arches_component_lab/widgets/api.ts";
import { buildLanguageAliasedNodeData } from "@/arches_component_lab/datatypes/language/utils.ts";

import type { Ref } from "vue";
import type {
    CardXNodeXWidgetData,
    Language,
} from "@/arches_component_lab/types.ts";
import type { LanguageAliasedNodeData } from "@/arches_component_lab/datatypes/language/types.ts";

const { value, cardXNodeXWidgetData } = defineProps<{
    cardXNodeXWidgetData?: CardXNodeXWidgetData;
    value: string | null;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: string | null): void;
    (event: "update:isLoading", isLoading: boolean): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: LanguageAliasedNodeData,
    ): void;
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
    emit(
        "update:aliasedNodeData",
        buildLanguageAliasedNodeData(updatedValue, languages.value ?? []),
    );
}
</script>

<template>
    <Select
        option-value="code"
        option-label="name"
        :input-id="cardXNodeXWidgetData?.node.alias"
        :loading="isLoading"
        :options="languages as Language[]"
        :placeholder="cardXNodeXWidgetData?.config.placeholder"
        :fluid="true"
        :model-value="value"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
