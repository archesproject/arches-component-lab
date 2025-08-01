<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import { useGettext } from "vue3-gettext";

import Editor from "primevue/editor";
import Select from "primevue/select";

import { fetchLanguages } from "@/arches_component_lab/widgets/api.ts";
import GenericFormField from "@/arches_component_lab/generics/GenericFormField.vue";

import type { FormFieldResolverOptions } from "@primevue/forms";
import type {
    StringCardXNodeXWidgetData,
    Language,
} from "@/arches_component_lab/types.ts";
import type { StringValue } from "@/arches_component_lab/datatypes/string/types.ts";

const props = defineProps<{
    cardXNodeXWidgetData: StringCardXNodeXWidgetData;
    nodeAlias: string;
    value: StringValue;
}>();

const { $gettext } = useGettext();

const languages = ref<Language[]>([]);
const selectedLanguage = ref<Language>();
const managedNodeValue = ref<StringValue["node_value"]>();
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
    const workingObject = { ...props.value.node_value };
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

function transformValueForForm(event: FormFieldResolverOptions) {
    if (!selectedLanguage.value || !event.value) {
        return;
    }
    if (event.value?.code) {
        // Ignore events emitted by language switcher.
        return;
    }
    return {
        display_value: event.value,
        node_value: {
            ...managedNodeValue.value,
            [selectedLanguage.value.code]: {
                value: event.value,
                direction: selectedLanguage.value.default_direction,
            },
        },
        details: [],
    };
}
</script>

<template>
    <GenericFormField
        v-bind="$attrs"
        :node-alias="nodeAlias"
        :transform-value-for-form="transformValueForForm"
    >
        <div style="display: flex; flex-direction: column; row-gap: 0.5rem">
            <Select
                v-model="selectedLanguage"
                :aria-label="$gettext('Select language for node value')"
                :options="languages"
                :option-label="
                    (lang: Language) => `${lang.name} (${lang.code})`
                "
                :placeholder="$gettext('Language')"
                :pt="{
                    label: { style: { fontSize: '1rem' } },
                    optionLabel: { style: { fontSize: '1rem' } },
                }"
            />
            <Editor
                type="text"
                :fluid="true"
                :model-value="singleInputValue"
                :maxlength="cardXNodeXWidgetData.config.maxLength"
                :placeholder="cardXNodeXWidgetData.config.placeholder ?? ''"
                :required="cardXNodeXWidgetData.node.isrequired"
                form-input
            />
        </div>
    </GenericFormField>
</template>
