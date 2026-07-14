<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useGettext } from "vue3-gettext";

import type { PropType } from "vue";
import type { BooleanCardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { BooleanAliasedNodeData } from "@/arches_component_lab/datatypes/boolean/types.ts";

interface RadioBooleanWidgetViewerProps {
    cardXNodeXWidgetData?: BooleanCardXNodeXWidgetData;
    aliasedNodeData: BooleanAliasedNodeData;
}

const { cardXNodeXWidgetData, aliasedNodeData } = defineProps({
    cardXNodeXWidgetData: {
        type: Object as PropType<
            RadioBooleanWidgetViewerProps["cardXNodeXWidgetData"]
        >,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<
            RadioBooleanWidgetViewerProps["aliasedNodeData"]
        >,
        required: true,
    },
});

interface RadioBooleanWidgetViewerEmits {
    (event: "initialized", updatedValue: BooleanAliasedNodeData): void;
}

const emit: RadioBooleanWidgetViewerEmits = defineEmits(["initialized"]);

const { $gettext } = useGettext();

onMounted(() => {
    emit("initialized", aliasedNodeData);
});

const displayValue = computed(() => {
    if (aliasedNodeData?.node_value === true) {
        return cardXNodeXWidgetData?.node.config.trueLabel || $gettext("True");
    } else if (aliasedNodeData?.node_value === false) {
        return (
            cardXNodeXWidgetData?.node.config.falseLabel || $gettext("False")
        );
    }
    return null;
});
</script>

<template>
    <div>{{ displayValue }}</div>
</template>
