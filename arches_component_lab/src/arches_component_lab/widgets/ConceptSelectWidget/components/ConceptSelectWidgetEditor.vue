<script setup lang="ts">
import { ref, watchEffect } from "vue";

import { useGettext } from "vue3-gettext";
import TreeSelect from "primevue/treeselect";

import { fetchConceptsTree } from "@/arches_component_lab/datatypes/concept/api.ts";

import type { FormFieldResolverOptions } from "@primevue/forms";

import type {
    CollectionItem,
    ConceptValue,
    ConceptFetchResult,
} from "@/arches_component_lab/datatypes/concept/types.ts";

import GenericFormField from "@/arches_component_lab/generics/GenericFormField.vue";
import { convertConceptOptionToFormValue } from "@/arches_component_lab/datatypes/concept/utils.ts";
import type { AliasedNodeData } from "@/arches_component_lab/types.ts";

const props = defineProps<{
    graphSlug: string;
    nodeAlias: string;
    multiSelect?: boolean;
    value?: ConceptValue | string;
}>();

const { $gettext } = useGettext();

const options = ref<CollectionItem[]>([]);
const isLoading = ref(false);
const optionsPage = ref(0);
const optionsTotalCount = ref(0);
const fetchError = ref<string | null>(null);
const hasMore = ref<boolean>(true);

watchEffect(() => {
    getOptions(1);
});

async function getOptions(page: number, filterTerm?: string) {
    try {
        isLoading.value = true;

        const fetchedData: ConceptFetchResult = await fetchConceptsTree(
            props.graphSlug,
            props.nodeAlias,
            page,
            filterTerm,
        );

        if (optionsPage.value == 0) {
            options.value = fetchedData.results as CollectionItem[];
            optionsPage.value = 1;
        } else {
            options.value = [
                ...options.value,
                ...(fetchedData.results as CollectionItem[]),
            ];
        }

        hasMore.value = fetchedData.more;
        optionsTotalCount.value = options.value.length;
    } catch (error) {
        fetchError.value = (error as Error).message;
    } finally {
        isLoading.value = false;
    }
}

function transformValueForForm(
    event: FormFieldResolverOptions,
): AliasedNodeData {
    if (!event.value || Object.keys(event.value).length == 0) {
        return {
            display_value: "",
            node_value: [],
            details: [],
        };
    }
    const id = Object.keys(event.value)[0];
    return convertConceptOptionToFormValue(id, options.value);
}
</script>

<template>
    <GenericFormField
        v-bind="$attrs"
        :node-alias="nodeAlias"
        :transform-value-for-form="transformValueForForm"
    >
        <TreeSelect
            :id="`${props.graphSlug}-${props.nodeAlias}-input`"
            data-key="key"
            selection-mode="single"
            :fluid="true"
            :loading="isLoading"
            :options
            :placeholder="$gettext('Select Concept')"
            :reset-filter-on-hide="true"
        >
        </TreeSelect>
    </GenericFormField>
</template>
