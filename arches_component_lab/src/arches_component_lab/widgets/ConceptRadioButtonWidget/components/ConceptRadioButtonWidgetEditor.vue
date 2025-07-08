<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from "vue";

import { FormField } from "@primevue/forms";

import Message from "primevue/message";
import { RadioButton, RadioButtonGroup } from "primevue";

import { fetchConceptsForNode } from "@/arches_component_lab/widgets/api.ts";

import type { FormFieldResolverOptions } from "@primevue/forms";

import type {
    ConceptOption,
    ConceptFetchResult,
} from "@/arches_component_lab/widgets/types.ts";

const props = withDefaults(
    defineProps<{
        graphSlug: string;
        nodeAlias: string;
        value?: ConceptOption | null;
        groupDirection?: string;
    }>(),
    {
        value: undefined,
        groupDirection: "column",
    },
);

const emit = defineEmits(["update:isDirty", "update:value"]);

const flexDirection = computed(() => {
    return props.groupDirection === "column" ? "flex-column" : "flex-row gap-2";
});

const formFieldRef = useTemplateRef("formField");

const options = ref<ConceptOption[]>([]);
const isLoading = ref(false);
const optionsPage = ref(0);
const optionsTotalCount = ref(0);
const fetchError = ref<string | null>(null);
const hasMore = ref<boolean>(false);

onMounted(async () => {
    await getOptions(1);
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

        if (optionsPage.value == 0) {
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

function resolver(e: FormFieldResolverOptions) {
    validate(e);

    let value = e.value;

    // @ts-expect-error This is a bug with PrimeVue types
    emit("update:isDirty", Boolean(formFieldRef.value!.fieldAttrs.dirty));
    emit("update:value", value);

    return {
        values: {
            [props.nodeAlias]: options.value.find((option) => {
                return value && value === option.id;
            }),
        },
    };
}

function validate(e: FormFieldResolverOptions) {
    console.log("validate", e);
}
</script>

<template>
    <Message
        v-if="fetchError"
        severity="error"
    >
        {{ fetchError }}
    </Message>
    <FormField
        v-else
        ref="formField"
        v-slot="$field"
        :name="props.nodeAlias"
        :initial-value="props.value?.id"
        :resolver="resolver"
    >
        <RadioButtonGroup
            :name="props.nodeAlias"
            :class="['flex flex-wrap', flexDirection]"
        >
            <div
                v-for="option in options"
                :key="option.id"
                class="flex items-center gap-2 flex-row"
            >
                <RadioButton
                    :input-id="option.id"
                    input-class="brett_test"
                    name="dynamic"
                    :value="option.id"
                    size="small"
                />
                <label :for="option.id">{{ option.text }}</label>
            </div>
        </RadioButtonGroup>
        <Message
            v-for="error in $field.errors"
            :key="error.message"
            severity="error"
            size="small"
        >
            {{ error.message }}
        </Message>
    </FormField>
</template>

<style scoped>
/* These utility classes not available until Bootstrap 4+ */

.flex-column {
    flex-direction: column;
}

.flex-row {
    flex-direction: row;
}
</style>
