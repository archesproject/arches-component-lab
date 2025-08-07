<script setup lang="ts">
import { ref } from "vue";

import Select from "primevue/select";
import GenericFormField from "@/arches_component_lab/generics/GenericFormField.vue";

import type { FormFieldResolverOptions } from "@primevue/forms";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { DomainValue, DomainOption } from "@/arches_component_lab/datatypes/domain/types.ts";

const props = defineProps<{
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    nodeAlias: string;
    value: DomainValue;
}>();

const options = ref<DomainOption[]>(props.cardXNodeXWidgetData.node.config.options);

function transformValueForForm(event: FormFieldResolverOptions) {
    console.log("event.value",event.value);
    return {
        display_value: event.value,
        node_value: event.value,
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
        <Select
            option-value="id"
            option-label="text"
            :options="options"
            :placeholder="cardXNodeXWidgetData.config.placeholder"
            :fluid="true"
            :model-value="value.node_value"
        />
    </GenericFormField>
</template>
