<script setup lang="ts">
import { watch } from "vue";

import arches from "arches";

import type { PropType } from "vue";
import type { ResourceInstanceListAliasedNodeData } from "@/arches_component_lab/datatypes/resource-instance-list/types";

interface ResourceInstanceMultiselectWidgetViewerProps {
    aliasedNodeData?: ResourceInstanceListAliasedNodeData | null;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<
            ResourceInstanceMultiselectWidgetViewerProps["aliasedNodeData"]
        >,
        default: undefined,
    },
});

interface ResourceInstanceMultiselectWidgetViewerEmits {
    (
        event: "initialized",
        updatedValue: ResourceInstanceListAliasedNodeData,
    ): void;
}

const emit: ResourceInstanceMultiselectWidgetViewerEmits = defineEmits([
    "initialized",
]);

watch(
    () => aliasedNodeData,
    (newValue) => {
        if (newValue) {
            emit("initialized", newValue);
        }
    },
    { immediate: true },
);
</script>

<template>
    <div
        v-for="item in aliasedNodeData?.details"
        :key="item.resource_id"
    >
        <a
            :href="`${arches.urls.resource_editor}${item.resource_id}`"
            class="resource-instance-link"
        >
            {{ item.display_value }}
        </a>
    </div>
</template>
