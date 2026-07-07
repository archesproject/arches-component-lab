<script setup lang="ts">
import { computed, toRef } from "vue";

import { useConceptLabelResolver } from "@/arches_component_lab/datatypes/concept/useConceptLabelResolver.ts";

import type { AliasedNodeData } from "@/arches_component_lab/types.ts";

const { value, graphSlug, nodeAlias, aliasedNodeData } = defineProps<{
    value: string | null;
    graphSlug?: string;
    nodeAlias?: string;
    aliasedNodeData?: AliasedNodeData | null;
}>();

const { label } = useConceptLabelResolver(
    toRef(() => (aliasedNodeData !== undefined ? null : value)),
    graphSlug ?? "",
    nodeAlias ?? "",
);

const displayLabel = computed(
    () => aliasedNodeData?.display_value || label.value,
);
</script>

<template>
    <div>{{ displayLabel }}</div>
</template>
