<script setup lang="ts">
import { computed, ref } from "vue";
import type { Ref } from "vue";

import { useGettext } from "vue3-gettext";
import TreeSelect from "primevue/treeselect";

import { fetchConceptsTree } from "@/arches_component_lab/datatypes/concept/api.ts";
import type { ConceptListValue } from "@/arches_component_lab/datatypes/concept-list/types.ts";
import { convertSelectionToModelValue } from "@/arches_component_lab/datatypes/concept-list/utils.ts";

import type {
    CollectionItem,
    ConceptFetchResult,
} from "@/arches_component_lab/datatypes/concept/types.ts";

defineOptions({ inheritAttrs: false }); // <— critical
const props = defineProps<{
    graphSlug: string;
    nodeAlias: string;
    aliasedNodeData: ConceptListValue;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: ConceptListValue): void;
}>();

const { $gettext } = useGettext();

const options: Ref<CollectionItem[]> = ref<CollectionItem[]>([]);
const isLoading = ref(false);
const optionsTotalCount = ref(0);
const fetchError = ref<string | null>(null);


const initialValue = computed<string[]>(() => {
    if (!options.value || options.value.length === 0) return [];
    // const selectedConcepts = props.value.node_value || [];
    return (props.aliasedNodeData.node_value || []);
    // return selectedConcepts.reduce(
    //           (acc: Record<string, boolean>, item: string) => {
    //               acc[item] = true;
    //               return acc;
    //           },
    //           {},
    //       );
});

// watchEffect(() => {
//     getOptions();
// });

async function getOptions() {
    try {
        isLoading.value = true;

        const fetchedData: ConceptFetchResult = await fetchConceptsTree(
            props.graphSlug,
            props.nodeAlias,
        );

        options.value = fetchedData.results as CollectionItem[];

        optionsTotalCount.value = options.value.length;
    } catch (error) {
        fetchError.value = (error as Error).message;
    } finally {
        isLoading.value = false;
    }
}

function onUpdateModelValue(selectedConcepts: string[]) {
    const formattedValue: ConceptListValue = convertSelectionToModelValue(selectedConcepts, options.value);
    emit("update:value", formattedValue);
}
</script>

<template>
    <TreeSelect
        :id="`${graphSlug}-${nodeAlias}-input`"
        selection-mode="multiple"
        :fluid="true"
        :loading="isLoading"
        :value="initialValue"
        :model-value="initialValue"
        :options="options"
        :placeholder="$gettext('Select Concepts')"
        @update:model-value="onUpdateModelValue"
        @before-show="getOptions"
    >
    </TreeSelect>
</template>
