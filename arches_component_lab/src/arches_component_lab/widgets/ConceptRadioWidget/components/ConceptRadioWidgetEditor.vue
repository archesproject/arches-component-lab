<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";

import RadioButton from "primevue/radiobutton";
import RadioButtonGroup from "primevue/radiobuttongroup";

import { fetchConceptsTree } from "@/arches_component_lab/datatypes/concept/api.ts";
import type { FormFieldResolverOptions } from "@primevue/forms";
import type {
    ConceptValue,
    ConceptFetchResult,
    CollectionItem,
} from "@/arches_component_lab/datatypes/concept/types.ts";

import GenericFormField from "@/arches_component_lab/generics/GenericFormField.vue";
import {
    convertConceptOptionToFormValue,
    flattenCollectionItems,
} from "@/arches_component_lab/datatypes/concept/utils.ts";
import type { AliasedNodeData } from "@/arches_component_lab/types.ts";

const props = defineProps<{
    graphSlug: string;
    nodeAlias: string;
    value?: string | ConceptValue | null;
    groupDirection: string;
}>();

const flexDirection = computed(() =>
    props.groupDirection === "column" ? "flex-column" : "flex-row gap-2",
);

const options = ref<CollectionItem[]>([]);
const selectedId = ref<string | null>(
    !props.value
        ? null
        : typeof props.value == "string"
          ? props.value
          : props.value.node_value,
);

const isLoading = ref(false);
const optionsTotalCount = ref(0);
const fetchError = ref<string | null>(null);

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

        options.value = flattenCollectionItems(fetchedData.results);

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
    return convertConceptOptionToFormValue(event.value, options.value);
}
</script>

<template>
    <GenericFormField
        v-bind="$attrs"
        :node-alias="nodeAlias"
        :transform-value-for-form="transformValueForForm"
    >
        <RadioButtonGroup
            v-model="selectedId"
            :name="nodeAlias"
            :class="['flex flex-wrap', flexDirection]"
        >
            <div
                v-for="option in options"
                :key="option.key"
                class="flex items-center gap-2 flex-row"
            >
                <RadioButton
                    :input-id="option.key"
                    :value="option.key"
                    size="small"
                />
                <label :for="option.key">{{ option.label }}</label>
            </div>
        </RadioButtonGroup>
    </GenericFormField>
</template>

<style scoped>
.flex-column {
    flex-direction: column;
}
.flex-row {
    flex-direction: row;
    margin-right: 1rem;
}

.flex-row > .p-radiobutton,
.flex-column > .p-radiobutton {
    vertical-align: top;
}
</style>
