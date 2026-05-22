<script setup lang="ts">
import { computed, toRef } from "vue";

import { useConceptLabelsResolver } from "@/arches_component_lab/datatypes/concept-list/useConceptLabelsResolver.ts";

import type { AliasedNodeData } from "@/arches_component_lab/types.ts";

const { value, graphSlug, nodeAlias, aliasedNodeData } = defineProps<{
    value: string[] | null;
    graphSlug?: string;
    nodeAlias?: string;
    aliasedNodeData?: AliasedNodeData | null;
}>();

const { labels } = useConceptLabelsResolver(
    toRef(() => (aliasedNodeData?.display_value ? null : value)),
    graphSlug ?? "",
    nodeAlias ?? "",
);

const displayLabel = computed(
    () => aliasedNodeData?.display_value || labels.value.join(", "),
);
</script>

<template>
    <div>{{ displayLabel }}</div>
</template>
