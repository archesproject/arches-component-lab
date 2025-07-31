<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import RadioButton from "primevue/radiobutton";
import RadioButtonGroup from "primevue/radiobuttongroup";

import { fetchConceptsForNode } from "@/arches_component_lab/datatypes/concept/api.ts";
import type { FormFieldResolverOptions } from "@primevue/forms";
import type {
    ConceptValue,
    ConceptOption,
    ConceptFetchResult,
} from "@/arches_component_lab/datatypes/concept/types.ts";

import GenericFormField from "@/arches_component_lab/generics/GenericFormField.vue";
import { convertConceptOptionToFormValue } from "@/arches_component_lab/datatypes/concept/utils.ts";
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

const options = ref<ConceptOption[]>([]);
const selectedId = ref<string | ConceptOption | null>(props.value ?? null);

const isLoading = ref(false);
const optionsPage = ref(0);
const optionsTotalCount = ref(0);
const fetchError = ref<string | null>(null);
const hasMore = ref<boolean>(true);

onMounted(async () => {
    while (hasMore.value) await getOptions(optionsPage.value + 1);
});

async function getOptions(page: number, filterTerm?: string) {
    try {
        isLoading.value = true;
        const fetchedData: ConceptFetchResult = await fetchConceptsForNode(
            props.graphSlug,
            props.nodeAlias,
            page,
            filterTerm,
        );

        if (optionsPage.value === 0) {
            options.value = fetchedData.results;
            optionsPage.value = 1;
        } else {
            options.value = [...options.value, ...fetchedData.results];
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
                :key="option.id"
                class="flex items-center gap-2 flex-row"
            >
                <RadioButton
                    :input-id="option.id"
                    :value="option.id"
                    size="small"
                />
                <label :for="option.id">{{ option.text }}</label>
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
