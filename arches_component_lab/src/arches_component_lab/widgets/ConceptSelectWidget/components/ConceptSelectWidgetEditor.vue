<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";

import { useGettext } from "vue3-gettext";
import TreeSelect from "primevue/treeselect";

import { fetchConceptsTree } from "@/arches_component_lab/datatypes/concept/api.ts";

import type {
    CollectionItem,
    ConceptValue,
    ConceptFetchResult,
} from "@/arches_component_lab/datatypes/concept/types.ts";

import { convertConceptOptionToFormValue } from "@/arches_component_lab/datatypes/concept/utils.ts";

const { graphSlug, nodeAlias, aliasedNodeData } = defineProps<{
    graphSlug: string;
    nodeAlias: string;
    aliasedNodeData: ConceptValue;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: ConceptValue): void;
}>();

const { $gettext } = useGettext();

const options = ref<CollectionItem[]>([]);
const isLoading = ref(false);
const optionsLoaded = ref(false);
const optionsTotalCount = ref(0);
const fetchError = ref<string | null>(null);

const initialValue = computed<Record<string, boolean>>(() => {
    if (options.value.length === 0 || !aliasedNodeData?.node_value) return {};
    return { [aliasedNodeData.node_value]: true };
});

watchEffect(() => {
    getOptions();
});

async function getOptions() {
    try {
        if (optionsLoaded.value) return;
        isLoading.value = true;

        const fetchedData: ConceptFetchResult = await fetchConceptsTree(
            graphSlug,
            nodeAlias,
        );

        options.value = fetchedData.results as CollectionItem[];

        optionsTotalCount.value = options.value.length;
    } catch (error) {
        fetchError.value = (error as Error).message;
    } finally {
        isLoading.value = false;
        optionsLoaded.value = true;
    }
}

function onUpdateModelValue(selectedOption: Record<string, boolean> | null) {
    const formattedValue = convertConceptOptionToFormValue(
        selectedOption,
        options.value,
    );
    emit("update:value", formattedValue);
}
</script>

<template>
    <TreeSelect
        :id="`${graphSlug}-${nodeAlias}-input`"
        data-key="key"
        selection-mode="single"
        :fluid="true"
        :loading="isLoading"
        :model-value="initialValue"
        :options="options"
        :placeholder="$gettext('Select Concept')"
        :reset-filter-on-hide="true"
        @update:model-value="onUpdateModelValue"
    >
    </TreeSelect>
</template>
