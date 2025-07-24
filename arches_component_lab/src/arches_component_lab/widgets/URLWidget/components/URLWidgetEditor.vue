<script setup lang="ts">
import { ref } from "vue";
import { useGettext } from "vue3-gettext";

import InputText from "primevue/inputtext";
import type { FormFieldResolverOptions } from "@primevue/forms";

import GenericFormField from "@/arches_component_lab/generic/GenericFormField.vue";
import type { URLValue } from "@/arches_component_lab/datatypes/url/types";

const { $gettext } = useGettext();

const { nodeAlias, value } = defineProps<{
    nodeAlias: string;
    value: URLValue | null | undefined;
}>();

const url_label = ref(value?.node_value?.url_label || "");
const url = ref(value?.node_value?.url || "");

function resolver(event: FormFieldResolverOptions) {
    if (!event.value) {
        return null;
    }

    return {
        url_label: url_label.value,
        url: url.value,
    };
}
</script>

<template>
    <GenericFormField
        v-bind="$attrs"
        :node-alias="nodeAlias"
        :initial-value="value"
        :resolver="resolver"
    >
        <div>url label</div>
        <InputText
            type="text"
            v-model="url_label"
            :placeholder="$gettext('Enter URL label...')"
            :fluid="true"
        />   
        <div>url</div>
        <InputText
            type="text"
            v-model="url"
            :required="true"
            :placeholder="$gettext('Enter URL...')"
            :fluid="true"
        />
        <div>preview</div>
        <a
            v-if="url"
            :href="url"
        >
            {{ url_label || url }}
        </a>
    </GenericFormField>
</template>
