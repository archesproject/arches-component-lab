<script setup lang="ts">
import type { ConceptValue } from "@/arches_component_lab/datatypes/concept/types.ts";
import { computed } from "vue";

import { useGettext } from "vue3-gettext";

const props = defineProps<{
    value?:  ConceptValue;
}>();

const { $gettext } = useGettext();

const dataValue = computed(() =>
    !props.value
        ? { display_value: $gettext("Unknown"), node_value: $gettext("Unknown") }
          : props.value
);
</script>
<template>
    <div :key="dataValue.node_value">{{ dataValue.display_value }}</div>
</template>
