<script setup lang="ts">
import { computed, toRef } from "vue";

import arches from "arches";

import { useResourceDisplayNamesResolver } from "@/arches_component_lab/datatypes/resource-instance-list/useResourceDisplayNamesResolver.ts";
import type { ResourceInstanceReference } from "@/arches_component_lab/datatypes/resource-instance-list/types";
import type { AliasedNodeData } from "@/arches_component_lab/types.ts";

const { value, graphSlug, nodeAlias, aliasedNodeData } = defineProps<{
    value: ResourceInstanceReference[] | null;
    graphSlug?: string;
    nodeAlias?: string;
    aliasedNodeData?: AliasedNodeData | null;
}>();

const { resolved: resolvedItems } = useResourceDisplayNamesResolver(
    toRef(() => (aliasedNodeData?.details?.length ? null : value)),
    graphSlug ?? "",
    nodeAlias ?? "",
);

const resolved = computed(() =>
    aliasedNodeData?.details?.length
        ? (aliasedNodeData.details as {
              resource_id: string;
              display_value: string;
          }[])
        : resolvedItems.value,
);
</script>

<template>
    <div
        v-for="item in resolved"
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
