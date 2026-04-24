<script setup lang="ts">
import { toRef } from "vue";

import { useConceptListEnrichment } from "@/arches_component_lab/datatypes/concept-list/useConceptListEnrichment.ts";

const props = defineProps<{
    nodeValue: string[] | null;
    graphSlug: string;
    nodeAlias: string;
}>();

const { labels } = useConceptListEnrichment(
    toRef(props, "nodeValue"),
    props.graphSlug,
    props.nodeAlias,
);
</script>

<template>
    <div>{{ labels.join(", ") }}</div>
</template>
