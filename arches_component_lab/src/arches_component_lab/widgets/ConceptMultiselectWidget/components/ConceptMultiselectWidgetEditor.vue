<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import type { Ref } from "vue";

import { useGettext } from "vue3-gettext";
import TreeSelect from "primevue/treeselect";

import { fetchConceptsTree } from "@/arches_component_lab/datatypes/concept/api.ts";
import type { ConceptListValue } from "@/arches_component_lab/datatypes/concept/types.ts";

import type { FormFieldResolverOptions } from "@primevue/forms";

import type {
    CollectionItem,
    ConceptFetchResult,
} from "@/arches_component_lab/datatypes/concept/types.ts";
import GenericFormField from "@/arches_component_lab/generics/GenericFormField.vue";
import { convertConceptOptionToFormValue } from "@/arches_component_lab/datatypes/concept/utils.ts";

const props = defineProps<{
    graphSlug: string;
    nodeAlias: string;
    value?: ConceptListValue;
}>();

const selectedConcepts = ref<string[]>([]);
if (
    props.value &&
    Object.hasOwnProperty.call(props.value, "node_value") &&
    (props.value as ConceptListValue).node_value.length > 0
) {
    selectedConcepts.value = (props.value as ConceptListValue)
        .node_value as string[];
}

const { $gettext } = useGettext();

const options: Ref<CollectionItem[]> = ref<CollectionItem[]>([]);
const isLoading = ref(false);
const optionsTotalCount = ref(0);
const fetchError = ref<string | null>(null);
const hasMore = ref<boolean>(true);

const initialValue = computed<Record<string, boolean>>(() => {
    if (options.value.length == 0) return {};
    return props?.value?.node_value
        ? props.value.node_value.reduce(
              (acc: Record<string, boolean>, item: string) => {
                  acc[item] = true;
                  return acc;
              },
              {},
          )
        : {};
});

watchEffect(() => {
    getOptions();
});

async function getOptions() {
    try {
        isLoading.value = true;

        const fetchedData: ConceptFetchResult = await fetchConceptsTree(
            props.graphSlug,
            props.nodeAlias,
        );

        options.value = fetchedData.results as CollectionItem[];

        hasMore.value = false;
        optionsTotalCount.value = options.value.length;
    } catch (error) {
        fetchError.value = (error as Error).message;
    } finally {
        isLoading.value = false;
    }
}

function transformValueForForm(
    event: FormFieldResolverOptions,
): ConceptListValue {
    if (!event.value || Object.keys(event.value).length == 0) {
        return {
            display_value: "",
            node_value: [],
            details: [],
        };
    }
    const allOptions: ConceptListValue[] = Object.keys(event.value).map(
        (key) => {
            return convertConceptOptionToFormValue(key, options.value);
        },
    );
    return {
        display_value: allOptions
            .map((option: ConceptListValue) => option.display_value)
            .join(", "),
        node_value: allOptions.map(
            (option) => (option.node_value as string[])[0],
        ),
        details: allOptions.map((option) => option.details[0]),
    };
}
</script>

<template>
    <GenericFormField
        v-bind="$attrs"
        :node-alias="nodeAlias"
        :transform-value-for-form="transformValueForForm"
    >
        <TreeSelect
            :id="`${graphSlug}-${nodeAlias}-input`"
            selection-mode="multiple"
            :fluid="true"
            :loading="isLoading"
            :model-value="initialValue"
            :options
            :placeholder="$gettext('Select Concepts')"
        >
        </TreeSelect>
    </GenericFormField>
</template>
