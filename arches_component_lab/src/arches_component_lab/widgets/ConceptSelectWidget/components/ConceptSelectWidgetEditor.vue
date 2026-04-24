<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import type { Ref } from "vue";

import TreeSelect from "primevue/treeselect";
import type { TreeNode } from "primevue/treenode";

import { fetchConceptsTree } from "@/arches_component_lab/datatypes/concept/api.ts";

import type {
    CollectionItem,
    ConceptFetchResult,
} from "@/arches_component_lab/datatypes/concept/types.ts";
import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";

const { graphSlug, nodeAlias, nodeValue, cardXNodeXWidgetData } = defineProps<{
    graphSlug: string;
    nodeAlias: string;
    nodeValue: string | null;
    cardXNodeXWidgetData: CardXNodeXWidgetData;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: string | null): void;
    (event: "update:isLoading", isLoading: boolean): void;
}>();

const options: Ref<CollectionItem[] | null> = ref<CollectionItem[] | null>(
    null,
);
const isLoading = ref(false);
const optionsLoaded = ref(false);
const optionsTotalCount = ref(0);
const fetchError = ref<string | null>(null);

const initialValue = computed<Record<string, boolean> | null>(
    (): Record<string, boolean> | null => {
        if (!nodeValue) return null;
        return { [nodeValue]: true };
    },
);

watch(isLoading, (newValue) => {
    emit("update:isLoading", newValue);
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
    const id = selectedOption ? Object.keys(selectedOption)[0] ?? null : null;
    emit("update:value", id);
}
</script>

<template>
    <TreeSelect
        :input-id="cardXNodeXWidgetData.node.alias"
        data-key="key"
        selection-mode="single"
        filter
        :fluid="true"
        :show-clear="true"
        :loading="isLoading"
        :model-value="initialValue"
        :options="options as TreeNode[]"
        :placeholder="cardXNodeXWidgetData.config.placeholder"
        :reset-filter-on-hide="true"
        @update:model-value="onUpdateModelValue"
    >
    </TreeSelect>
</template>
