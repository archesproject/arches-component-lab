<script setup lang="ts">
import { computed } from "vue";
import { useGettext } from "vue3-gettext";

import type { BooleanCardXNodeXWidgetData } from "@/arches_component_lab/types.ts";

const { $gettext } = useGettext();

const { nodeValue, cardXNodeXWidgetData } = defineProps<{
    nodeValue: boolean | null;
    cardXNodeXWidgetData: BooleanCardXNodeXWidgetData;
}>();

const displayValue = computed(() => {
    if (nodeValue === true) {
        return cardXNodeXWidgetData.node.config.trueLabel || $gettext("True");
    } else if (nodeValue === false) {
        return cardXNodeXWidgetData.node.config.falseLabel || $gettext("False");
    }
    return null;
});
</script>

<template>
    <div>{{ displayValue }}</div>
</template>
