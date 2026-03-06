<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";

import { useGettext } from "vue3-gettext";

import Select from "primevue/select";

import ResourceInstanceCreation from "@/arches_component_lab/widgets/ResourceInstanceMultiselectWidget/components/ResourceInstanceCreation.vue";

import { fetchRelatableResources } from "@/arches_component_lab/datatypes/resource-instance/api.ts";
import { debounce } from "@/arches_component_lab/utils.ts";

import type { SelectFilterEvent } from "primevue/select";
import type { VirtualScrollerLazyEvent } from "primevue/virtualscroller";

import type {
    ResourceInstanceValue,
    ResourceInstanceDataItem,
    ResourceInstanceSelectOption,
    ResourceInstanceCardXNodeXWidgetData,
} from "@/arches_component_lab/datatypes/resource-instance/types.ts";

import type { AliasedTileData } from "@/arches_component_lab/types";

const {
    cardXNodeXWidgetData,
    nodeAlias,
    graphSlug,
    aliasedNodeData,
    shouldEmitSimplifiedValue,
    defaultTerm,
} = defineProps<{
    cardXNodeXWidgetData: ResourceInstanceCardXNodeXWidgetData;
    nodeAlias: string;
    graphSlug: string;
    aliasedNodeData: ResourceInstanceValue | null;
    shouldEmitSimplifiedValue?: boolean;
    defaultTerm?: string;
}>();

const emit = defineEmits<{
    (
        event: "update:value",
        updatedValue: ResourceInstanceValue | string[],
    ): void;
}>();

const { $gettext } = useGettext();

// in future iteration these may be declared in the CardXNodeXWidgetData config
const itemSize = 36;
const canCreateNewResources = true;

const options = ref<ResourceInstanceSelectOption[]>(
    aliasedNodeData?.details ?? [],
);
const isLoading = ref(false);
const resourceResultsPage = ref(0);
const resourceResultsTotalCount = ref(0);
const fetchError = ref<string | null>(null);
const emptyFilterMessage = ref($gettext("Search returned no results"));

const graphIdsInOptions = ref<Set<string>>(new Set());
const selectedGraphId = ref<string>("");
const showResourceCreation = ref(false);
const resourceCreationDialogKey = ref(0);

const resourceResultsCurrentCount = computed(() => options.value.length);
const selectedValue = ref<string | null>(
    aliasedNodeData?.details?.[0]?.resource_id ?? null,
);

watchEffect(() => {
    getOptions(1);
});

const onFilter = debounce((event: SelectFilterEvent) => {
    getOptions(1, event.value);
}, 600);

async function getOptions(page: number, filterTerm?: string) {
    try {
        isLoading.value = true;
        emptyFilterMessage.value = $gettext("Searching...");
        const filterTerms = [];
        if (defaultTerm) {
            filterTerms.push(defaultTerm);
        }
        if (filterTerm) {
            filterTerms.push(filterTerm);
        }
        const resourceData = await fetchRelatableResources(
            graphSlug,
            nodeAlias,
            page,
            filterTerms,
            selectedValue.value || aliasedNodeData?.details?.[0]?.resource_id,
        );

        const references = resourceData.data.map(
            (
                resourceRecord: ResourceInstanceDataItem,
            ): ResourceInstanceSelectOption => ({
                display_value: resourceRecord.display_value ?? "",
                resource_id: resourceRecord.resourceinstanceid,
            }),
        );

        if (resourceData.current_page == 1) {
            options.value = references;

            if (
                canCreateNewResources &&
                cardXNodeXWidgetData.node.config.graphs &&
                cardXNodeXWidgetData.node.config.graphs.length > 0
            ) {
                cardXNodeXWidgetData.node.config.graphs.forEach((graph) => {
                    const placeholder = $gettext("Create a new %{graphName}", {
                        graphName: graph.name,
                    });
                    options.value.unshift({
                        display_value: placeholder,
                        resource_id: graph.graphid,
                    });
                    graphIdsInOptions.value.add(graph.graphid);
                });
            }
        } else {
            options.value = [...options.value, ...references];
        }

        resourceResultsPage.value = resourceData.current_page;
        resourceResultsTotalCount.value = resourceData.total_results;
    } catch (error) {
        fetchError.value = (error as Error).message;
    } finally {
        isLoading.value = false;
        if (
            options.value.length - (aliasedNodeData?.details?.length ?? 0) ==
            0
        ) {
            emptyFilterMessage.value = $gettext("Search returned no results");
        }
    }
}

async function onLazyLoadResources(event?: VirtualScrollerLazyEvent) {
    if (isLoading.value) {
        return;
    }

    if (
        // if we have already fetched all the resources
        resourceResultsTotalCount.value > 0 &&
        resourceResultsCurrentCount.value >= resourceResultsTotalCount.value
    ) {
        return;
    }

    if (
        // if the user has NOT scrolled to the end of the list
        event &&
        event.last < resourceResultsCurrentCount.value - 1
    ) {
        return;
    }

    if (
        // if the dropdown is opened and we already have data
        !event &&
        resourceResultsCurrentCount.value > 0
    ) {
        return;
    }

    await getOptions((resourceResultsPage.value || 0) + 1);
}

function getOption(value: string): ResourceInstanceSelectOption | undefined {
    return options.value.find((option) => option.resource_id === value);
}

function onUpdateModelValue(updatedValue: string | null) {
    if (updatedValue && graphIdsInOptions.value.has(updatedValue)) {
        selectedGraphId.value = updatedValue;
    }
    if (selectedGraphId.value) {
        resourceCreationDialogKey.value++;
        showResourceCreation.value = true;
        return;
    }

    selectedValue.value = updatedValue;

    const option = updatedValue ? getOption(updatedValue) : undefined;

    if (shouldEmitSimplifiedValue) {
        emit("update:value", updatedValue ? [updatedValue] : []);
    } else {
        emit("update:value", {
            display_value: option ? option.display_value : "",
            node_value: updatedValue
                ? {
                      inverseOntologyProperty: "",
                      ontologyProperty: "",
                      resourceId: updatedValue,
                      resourceXresourceId: "",
                  }
                : null,
            details: option ? [option] : [],
        } as ResourceInstanceValue);
    }
}

async function onResourceCreated(createdTile: AliasedTileData) {
    selectedValue.value = createdTile.resourceinstance;
    getOptions(1);
    onUpdateModelValue(selectedValue.value);
    showResourceCreation.value = false;
}
</script>

<template>
    <Select
        display="chip"
        option-label="display_value"
        option-value="resource_id"
        :filter="true"
        :filter-fields="['display_value', 'resource_id']"
        :empty-filter-message="emptyFilterMessage"
        :filter-placeholder="$gettext('Filter Resources')"
        :fluid="true"
        :label-id="cardXNodeXWidgetData.node.alias"
        :loading="isLoading"
        :model-value="selectedValue"
        :options="options"
        :placeholder="cardXNodeXWidgetData.config.placeholder"
        :reset-filter-on-hide="true"
        :show-clear="true"
        :virtual-scroller-options="{
            itemSize: itemSize,
            lazy: true,
            loading: isLoading,
            onLazyLoad: onLazyLoadResources,
        }"
        :overlay-visible="showResourceCreation ? false : undefined"
        @filter="onFilter"
        @before-show="getOptions(1)"
        @update:model-value="onUpdateModelValue($event)"
    />
    <ResourceInstanceCreation
        v-if="showResourceCreation"
        :key="resourceCreationDialogKey"
        :graph-id="selectedGraphId!"
        @resource-created="onResourceCreated"
    />
</template>
