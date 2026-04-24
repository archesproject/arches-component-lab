<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";

import RadioButton from "primevue/radiobutton";
import RadioButtonGroup from "primevue/radiobuttongroup";

import { fetchConceptsTree } from "@/arches_component_lab/datatypes/concept/api.ts";
import type {
    ConceptFetchResult,
    CollectionItem,
} from "@/arches_component_lab/datatypes/concept/types.ts";

import { flattenCollectionItems } from "@/arches_component_lab/datatypes/concept/utils.ts";
import type { ConceptRadioCardXNodeXWidgetData } from "@/arches_component_lab/types.ts";

const {
    graphSlug,
    nodeAlias,
    nodeValue,
    cardXNodeXWidgetData,
} = defineProps<{
    graphSlug: string;
    nodeAlias: string;
    nodeValue: string | null;
    cardXNodeXWidgetData: ConceptRadioCardXNodeXWidgetData;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: string | null): void;
    (event: "update:isLoading", isLoading: boolean): void;
}>();

const flexDirection =
    cardXNodeXWidgetData.config.groupDirection === "column"
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
        isLoading.value = true;
        const fetchedData: ConceptFetchResult = await fetchConceptsTree(
            graphSlug,
            nodeAlias,
        );

        options.value = flattenCollectionItems(fetchedData.results);
        optionsTotalCount.value = options.value.length;
    } catch (error) {
        fetchError.value = (error as Error).message;
    } finally {
        isLoading.value = false;
        optionsLoaded.value = true;
    }
}

function onUpdateModelValue(value: string | null) {
    emit("update:value", value ?? null);
}
</script>

<template>
    <RadioButtonGroup
        :model-value="nodeValue"
        :class="['button-group', flexDirection]"
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
