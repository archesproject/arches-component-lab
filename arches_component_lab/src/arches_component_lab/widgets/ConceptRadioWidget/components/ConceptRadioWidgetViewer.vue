<script setup lang="ts">
import { toRef } from "vue";

import { useConceptLabelResolver } from "@/arches_component_lab/datatypes/concept/useConceptLabelResolver.ts";

const props = defineProps<{
    value: string | null;
    graphSlug: string;
    nodeAlias: string;
}>();

const { label } = useConceptLabelResolver(
    toRef(props, "value"),
    props.graphSlug,
    props.nodeAlias,
);
</script>

<template>
    <div>{{ label }}</div>
</template>
