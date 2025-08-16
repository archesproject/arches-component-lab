<script setup lang="ts">
import type { ConceptListValue } from "@/arches_component_lab/datatypes/concept/types.ts";
import { computed } from "vue";
import { useGettext } from "vue3-gettext";

const props = defineProps<{
    value?: ConceptListValue;
}>();

const { $gettext } = useGettext();

const dataValue = computed(() =>
    !props.value
        ? {
              display_value: $gettext("Unknown"),
              node_value: [$gettext("Unknown")],
          }
        : (props.value as ConceptListValue),
);
</script>
<template>
    <div :key="dataValue.node_value.join(',')">
        {{ dataValue.display_value }}
    </div>
</template>
