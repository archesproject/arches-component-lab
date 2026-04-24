<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import { useGettext } from "vue3-gettext";

import InputText from "primevue/inputtext";
import Select from "primevue/select";

import { fetchLanguages } from "@/arches_component_lab/widgets/api.ts";

import type {
    StringCardXNodeXWidgetData,
    Language,
} from "@/arches_component_lab/types.ts";
import type { LanguageValue } from "@/arches_component_lab/datatypes/string/types.ts";

const { $gettext } = useGettext();

const { cardXNodeXWidgetData, nodeValue } = defineProps<{
    cardXNodeXWidgetData: StringCardXNodeXWidgetData;
    nodeValue: Record<string, LanguageValue> | null;
}>();

const emit = defineEmits<{
    (
        event: "update:value",
        updatedValue: Record<string, LanguageValue>,
    ): void;
}>();

const languages = ref<Language[]>([]);
const selectedLanguage = ref<Language>();
const managedNodeValue = ref<Record<string, LanguageValue>>();
const singleInputValue = ref<string>();

watchEffect(async () => {
    const response = (await fetchLanguages()) as {
        languages: Language[];
        request_language: string;
    };
    languages.value = response.languages;
    selectedLanguage.value =
        languages.value.find(
            (lang) => lang.code === response.request_language,
        ) ?? response.languages[0];
});

watch(languages, () => {
    const workingObject = { ...nodeValue };
    for (const language of languages.value) {
        if (!workingObject[language.code]) {
            workingObject[language.code] = {
                value: "",
                direction: language.default_direction,
            };
        }
    }
    managedNodeValue.value = workingObject;
});

watch(selectedLanguage, () => {
    if (selectedLanguage.value && managedNodeValue.value) {
        singleInputValue.value =
            managedNodeValue.value[selectedLanguage.value.code].value;
    } else {
        singleInputValue.value = "";
    }
});

function onUpdateModelValue(updatedValue: string | undefined) {
    if (updatedValue === undefined) {
        updatedValue = "";
    }

    emit("update:value", {
        ...managedNodeValue.value,
        [selectedLanguage.value!.code]: {
            value: updatedValue,
            direction: selectedLanguage.value!.default_direction,
        },
    });
}
</script>

<template>
    <div style="display: flex; column-gap: 0.5rem">
        <Select
            v-model="selectedLanguage"
            class="language-selector"
            :aria-label="$gettext('Select language for node value')"
            :options="languages"
            :option-label="(lang: Language) => `${lang.name} (${lang.code})`"
            :placeholder="$gettext('Language')"
        />
        <InputText
            type="text"
            :fluid="true"
            :maxlength="cardXNodeXWidgetData.config.maxLength ?? undefined"
            :model-value="singleInputValue"
            :placeholder="cardXNodeXWidgetData.config.placeholder"
            :pt="{ root: { id: cardXNodeXWidgetData.node.alias } }"
            :required="cardXNodeXWidgetData.node.isrequired"
            @update:model-value="onUpdateModelValue($event)"
        />
    </div>
</template>

<style>
.p-select-options,
.p-select-label,
.p-select-overlay {
    font-size: 1rem;
}
</style>
