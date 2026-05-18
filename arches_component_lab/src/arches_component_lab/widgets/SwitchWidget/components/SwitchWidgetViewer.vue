<script setup lang="ts">
import { computed } from "vue";
import { useGettext } from "vue3-gettext";

import type { BooleanCardXNodeXWidgetData } from "@/arches_component_lab/types.ts";

const { value, cardXNodeXWidgetData } = defineProps<{
    value: boolean | null;
    cardXNodeXWidgetData: BooleanCardXNodeXWidgetData;
}>();

const { $gettext } = useGettext();

const displayValue = computed(() => {
    if (value === true) {
        return cardXNodeXWidgetData.node.config.trueLabel || $gettext("True");
    } else if (value === false) {
        return cardXNodeXWidgetData.node.config.falseLabel || $gettext("False");
    }
    return null;
});
</script>

<template>
    <div>{{ displayValue }}</div>
</template>
