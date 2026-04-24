<script setup lang="ts">
import { toRef } from "vue";

import { useConceptEnrichment } from "@/arches_component_lab/datatypes/concept/useConceptEnrichment.ts";

const props = defineProps<{
    nodeValue: string | null;
    graphSlug: string;
    nodeAlias: string;
}>();

const { label } = useConceptEnrichment(
    toRef(props, "nodeValue"),
    props.graphSlug,
    props.nodeAlias,
);
</script>

<template>
    <div>{{ label }}</div>
</template>
