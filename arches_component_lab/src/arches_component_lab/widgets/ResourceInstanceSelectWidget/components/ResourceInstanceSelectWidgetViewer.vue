<script setup lang="ts">
import { watch } from "vue";

import arches from "arches";

import type { PropType } from "vue";
import type { ResourceInstanceAliasedNodeData } from "@/arches_component_lab/datatypes/resource-instance/types";

interface ResourceInstanceSelectWidgetViewerProps {
    aliasedNodeData?: ResourceInstanceAliasedNodeData | null;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<
            ResourceInstanceSelectWidgetViewerProps["aliasedNodeData"]
        >,
        default: undefined,
    },
});

interface ResourceInstanceSelectWidgetViewerEmits {
    (event: "initialized", updatedValue: ResourceInstanceAliasedNodeData): void;
}

const emit: ResourceInstanceSelectWidgetViewerEmits = defineEmits([
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
    <div :key="aliasedNodeData?.node_value?.[0]?.resourceId ?? undefined">
        <a
            :href="`${arches.urls.resource_editor}${aliasedNodeData?.node_value?.[0]?.resourceId}`"
            class="resource-instance-link"
        >
            {{ aliasedNodeData?.display_value }}
        </a>
    </div>
</template>
