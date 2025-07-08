<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from "vue";

import { useGettext } from "vue3-gettext";
import { FormField } from "@primevue/forms";

import Message from "primevue/message";
import MultiSelect from "primevue/multiselect";
import Button from "primevue/button";

import { fetchConceptsForNode } from "@/arches_component_lab/widgets/api.ts";

import type { MultiSelectFilterEvent } from "primevue/multiselect";
import type { FormFieldResolverOptions } from "@primevue/forms";
import type { VirtualScrollerLazyEvent } from "primevue/virtualscroller";

import type {
    ConceptOption,
    ConceptFetchResult,
} from "@/arches_component_lab/widgets/types.ts";
import arches from "arches";

const props = defineProps<{
    graphSlug: string;
    nodeAlias: string;
    value?: ConceptOption[] | null | undefined;
}>();

const selectedValues = computed(() => {
    return value?.map((option) => option.id) || [];
});

const { value = [] } = props;

const emit = defineEmits(["update:isDirty", "update:value"]);

const { $gettext } = useGettext();

const itemSize = 36; // in future iteration this should be declared in the CardXNodeXWidget config

const formFieldRef = useTemplateRef("formField");

const options = ref<ConceptOption[]>([]);
const isLoading = ref(false);
const optionsPage = ref(0);
const optionsTotalCount = ref(0);
const fetchError = ref<string | null>(null);
const hasMore = ref<boolean>(false);

const optionsCurrentCount = computed(() => options?.value?.length || 0);

onMounted(async () => {
    await getOptions(1);
});

function clearOptions() {
    options.value = value ? value : [];
}

function onFilter(event: MultiSelectFilterEvent) {
    clearOptions();
    optionsPage.value = 0;
    hasMore.value = true;
    getOptions(1, event.value);
}

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

async function onLazyLoadResources(event?: VirtualScrollerLazyEvent) {
    if (isLoading.value) {
        return;
    }

    if (!hasMore.value) {
        return;
    }

    if (
        // if the user has NOT scrolled to the end of the list
        event &&
        event.last < optionsCurrentCount.value - 1
    ) {
        return;
    }

    if (
        // if the dropdown is opened and we already have data
        !event &&
        optionsCurrentCount.value > 0
    ) {
        return;
    }

    await getOptions((optionsPage.value || 0) + 1);
}

function getOption(value: string): ConceptOption | undefined {
    const option = options.value.find((option) => option.id == value);
    return option;
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
        :name="nodeAlias"
        :initial-value="selectedValues"
        :resolver="resolver"
    >
        <MultiSelect
            :id="`${graphSlug}-${nodeAlias}-input`"
            display="chip"
            option-label="text"
            option-value="id"
            :filter="true"
            :filter-placeholder="$gettext('Filter Concepts')"
            :fluid="true"
            :loading="isLoading"
            :options
            :placeholder="$gettext('Select Concepts')"
            :reset-filter-on-hide="true"
            :virtual-scroller-options="{
                itemSize: itemSize,
                lazy: true,
                loading: isLoading,
                onLazyLoad: onLazyLoadResources,
            }"
            @filter="onFilter"
            @before-show="getOptions(1)"
        >
            <template #chip="slotProps">
                <div style="width: 100%">
                    <div class="chip-text">
                        {{ getOption(slotProps.value)?.text }}
                    </div>
                </div>
                <div class="button-container">
                    <Button
                        icon="pi pi-times"
                        variant="text"
                        size="small"
                        @click.stop="
                            (e) => {
                                slotProps.removeCallback(e, slotProps.value);
                            }
                        "
                    />
                </div>
            </template>
        </MultiSelect>
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
.button-container {
    display: flex;
    justify-content: flex-end;
}

.chip-text {
    width: min-content;
    min-width: fit-content;
    overflow-wrap: anywhere;
    padding: 0.5rem 1rem;
}

:deep(.p-multiselect-label) {
    width: inherit;
    flex-direction: column;
    white-space: break-spaces;
    align-items: flex-start;
}

:deep(.p-multiselect-chip-item) {
    width: inherit;
    border: 0.125rem solid var(--p-inputtext-border-color);
    padding: 0.25rem;
    border-radius: 0.5rem;
    margin: 0.25rem;
}

:deep(.p-multiselect-label-container) {
    white-space: break-spaces;
    width: inherit;
}
</style>
