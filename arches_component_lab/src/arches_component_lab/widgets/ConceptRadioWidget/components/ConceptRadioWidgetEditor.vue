<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";

import RadioButton from "primevue/radiobutton";
import RadioButtonGroup from "primevue/radiobuttongroup";

import { useConceptTreeStore } from "@/arches_component_lab/stores/useConceptTreeStore.ts";
import type {
    ConceptFetchResult,
    CollectionItem,
} from "@/arches_component_lab/datatypes/concept/types.ts";

import {
    buildConceptAliasedNodeData,
    flattenCollectionItems,
} from "@/arches_component_lab/datatypes/concept/utils.ts";
import type { ConceptCardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { ConceptAliasedNodeData } from "@/arches_component_lab/datatypes/concept/types.ts";

const { graphSlug, nodeAlias, value, cardXNodeXWidgetData } = defineProps<{
    graphSlug?: string;
    nodeAlias?: string;
    value: string | null;
    cardXNodeXWidgetData?: ConceptCardXNodeXWidgetData;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: string | null): void;
    (event: "update:isLoading", isLoading: boolean): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: ConceptAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: ConceptAliasedNodeData): void;
}>();

const flexDirection =
    cardXNodeXWidgetData?.config?.groupDirection === "column"
        ? "flex-column"
        : "flex-row";

const options = ref<CollectionItem[]>([]);
const isLoading = ref(false);
const optionsLoaded = ref(false);
const optionsTotalCount = ref(0);
const fetchError = ref<string | null>(null);

watch(isLoading, (newValue) => {
    emit("update:isLoading", newValue);
});

watchEffect(() => {
    getOptions();
});

async function getOptions() {
    try {
        if (optionsLoaded.value) return;
        if (!graphSlug || !nodeAlias) return;
        isLoading.value = true;
        const fetchedData: ConceptFetchResult =
            await useConceptTreeStore().fetchTree(graphSlug, nodeAlias);

        options.value = flattenCollectionItems(fetchedData.results);
        optionsTotalCount.value = options.value.length;
    } catch (error) {
        fetchError.value = (error as Error).message;
    } finally {
        isLoading.value = false;
        if (!optionsLoaded.value) {
            emit(
                "initialized",
                buildConceptAliasedNodeData(value, options.value ?? []),
            );
        }
        optionsLoaded.value = true;
    }
}

function onUpdateModelValue(updatedValue: string | null) {
    const nodeValue = updatedValue ?? null;
    emit("update:value", nodeValue);
    emit(
        "update:aliasedNodeData",
        buildConceptAliasedNodeData(nodeValue, options.value),
    );
}
</script>

<template>
    <RadioButtonGroup
        :id="cardXNodeXWidgetData?.node.alias"
        :model-value="value"
        :class="['button-group', flexDirection]"
        tabindex="-1"
        @update:model-value="onUpdateModelValue"
    >
        <div
            v-for="option in options"
            :key="option.key"
            class="radio-options"
        >
            <RadioButton
                :input-id="option.key"
                :value="option.key"
                size="small"
            />
            <label :for="option.key">{{ option.label }}</label>
        </div>
    </RadioButtonGroup>
</template>

<style scoped>
.p-radiobutton {
    margin-right: 0.5rem;
}

label {
    all: unset;
}
.button-group {
    display: flex;
    flex-direction: row;
    column-gap: 1.5rem;
    row-gap: 0.5rem;
    flex-wrap: wrap;
}

.radio-options {
    display: flex;
    gap: 0.25rem;
    align-items: center;
}
.flex-column {
    flex-direction: column;
}
.flex-row {
    flex-direction: row;
    align-items: center;
}
.flex-row > .p-radiobutton,
.flex-column > .p-radiobutton {
    vertical-align: top;
}
</style>
