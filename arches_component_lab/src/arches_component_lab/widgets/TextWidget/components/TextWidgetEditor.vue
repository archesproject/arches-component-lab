<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import { useGettext } from "vue3-gettext";

import InputText from "primevue/inputtext";
import Select from "primevue/select";

import { fetchLanguages } from "@/arches_component_lab/widgets/api.ts";
import GenericFormField from "@/arches_component_lab/generics/GenericFormField.vue";

import type { FormFieldResolverOptions } from "@primevue/forms";
import type { Language } from "@/arches_component_lab/types.ts";
import type { StringValue } from "@/arches_component_lab/datatypes/string/types.ts";

const props = defineProps<{
    nodeAlias: string;
    value: StringValue;
}>();

const { $gettext } = useGettext();

const languages = ref<Language[]>([]);
const selectedLanguage = ref<Language>();
const managedNodeValue = ref<StringValue["node_value"]>();
const singleInputValue = ref<string>();

watchEffect(async () => {
    languages.value = (await fetchLanguages()) as Language[];
    selectedLanguage.value = languages.value.find((lang) => lang.isdefault);
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
    if (!selectedLanguage.value || event.value === undefined) {
        return;
    }
    if (event.value.code) {
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
        <div style="display: flex; column-gap: 0.5rem">
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
            <InputText
                type="text"
                :fluid="true"
                :model-value="singleInputValue"
                form-input
            />
        </div>
    </GenericFormField>
</template>
