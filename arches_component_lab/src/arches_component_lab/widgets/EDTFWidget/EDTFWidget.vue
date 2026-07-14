<script setup lang="ts">
import { computed } from "vue";

import EDTFWidgetEditor from "@/arches_component_lab/widgets/EDTFWidget/components/EDTFWidgetEditor/EDTFWidgetEditor.vue";
import EDTFWidgetViewer from "@/arches_component_lab/widgets/EDTFWidget/components/EDTFWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";
import { buildEDTFAliasedNodeData } from "@/arches_component_lab/datatypes/edtf/utils.ts";

import type { PropType } from "vue";
import type { EDTFAliasedNodeData } from "@/arches_component_lab/datatypes/edtf/types.ts";
import type { EDTFWidgetProps } from "@/arches_component_lab/widgets/EDTFWidget/types.ts";

const { aliasedNodeData, value } = defineProps({
    mode: {
        type: String as PropType<EDTFWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<EDTFWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<EDTFWidgetProps["graphSlug"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<EDTFWidgetProps["cardXNodeXWidgetData"]>,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<EDTFWidgetProps["aliasedNodeData"]>,
        default: undefined,
    },
    value: {
        type: String as PropType<EDTFWidgetProps["value"]>,
        default: undefined,
    },
});

interface EDTFWidgetEmits {
    (event: "update:isDirty", isDirty: boolean): void;
    (event: "update:value", updatedValue: string | null): void;
    (event: "update:aliasedNodeData", updatedValue: EDTFAliasedNodeData): void;
    (event: "initialized", updatedValue: EDTFAliasedNodeData): void;
}

const emit: EDTFWidgetEmits = defineEmits([
    "update:isDirty",
    "update:value",
    "update:aliasedNodeData",
    "initialized",
]);

const resolvedAliasedNodeData = computed(
    () => aliasedNodeData ?? buildEDTFAliasedNodeData(value ?? null),
);

function onUpdateAliasedNodeData(updatedAliasedNodeData: EDTFAliasedNodeData) {
    emit("update:aliasedNodeData", updatedAliasedNodeData);
    emit("update:value", updatedAliasedNodeData.node_value);
}
</script>

<template>
    <EDTFWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="resolvedAliasedNodeData"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <EDTFWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
