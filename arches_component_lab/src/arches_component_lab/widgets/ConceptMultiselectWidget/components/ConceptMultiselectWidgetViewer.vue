<script setup lang="ts">
import { toRef } from "vue";

import { useConceptLabelsResolver } from "@/arches_component_lab/datatypes/concept-list/useConceptLabelsResolver.ts";

const props = defineProps<{
    value: string[] | null;
    graphSlug: string;
    nodeAlias: string;
}>();

const { labels } = useConceptLabelsResolver(
    toRef(props, "value"),
    props.graphSlug,
    props.nodeAlias,
);
</script>

<template>
    <div>{{ labels.join(", ") }}</div>
</template>
