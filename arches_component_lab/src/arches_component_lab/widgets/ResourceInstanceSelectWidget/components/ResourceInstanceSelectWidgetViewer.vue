<script setup lang="ts">
import { computed, toRef } from "vue";

import arches from "arches";

import { useResourceDisplayNameResolver } from "@/arches_component_lab/datatypes/resource-instance/useResourceDisplayNameResolver.ts";
import type { ResourceInstanceReference } from "@/arches_component_lab/datatypes/resource-instance/types";
import type { AliasedNodeData } from "@/arches_component_lab/types.ts";

const { value, graphSlug, nodeAlias, aliasedNodeData } = defineProps<{
    value: ResourceInstanceReference | null;
    graphSlug?: string;
    nodeAlias?: string;
    aliasedNodeData?: AliasedNodeData | null;
}>();

const { displayValue: resolvedDisplayValue, resourceId } =
    useResourceDisplayNameResolver(
        toRef(() => value),
        graphSlug ?? "",
        nodeAlias ?? "",
    );

const displayValue = computed(
    () => aliasedNodeData?.display_value || resolvedDisplayValue.value,
);
</script>

<template>
    <div :key="resourceId ?? undefined">
        <a
            :href="`${arches.urls.resource_editor}${resourceId}`"
            class="resource-instance-link"
        >
            {{ displayValue }}
        </a>
    </div>
</template>
