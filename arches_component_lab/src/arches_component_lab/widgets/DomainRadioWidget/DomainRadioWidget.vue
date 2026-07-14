<script setup lang="ts">
import { computed } from "vue";

import DomainRadioWidgetEditor from "@/arches_component_lab/widgets/DomainRadioWidget/components/DomainRadioWidgetEditor.vue";
import DomainRadioWidgetViewer from "@/arches_component_lab/widgets/DomainRadioWidget/components/DomainRadioWidgetViewer.vue";

import { buildDomainAliasedNodeData } from "@/arches_component_lab/datatypes/domain/utils.ts";
import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { PropType } from "vue";
import type { DomainAliasedNodeData } from "@/arches_component_lab/datatypes/domain/types.ts";
import type { DomainRadioWidgetProps } from "@/arches_component_lab/widgets/DomainRadioWidget/types.ts";

const { aliasedNodeData, cardXNodeXWidgetData, value } = defineProps({
    mode: {
        type: String as PropType<DomainRadioWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<DomainRadioWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<DomainRadioWidgetProps["graphSlug"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<
            DomainRadioWidgetProps["cardXNodeXWidgetData"]
        >,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<DomainRadioWidgetProps["aliasedNodeData"]>,
        default: undefined,
    },
    value: {
        type: String as PropType<DomainRadioWidgetProps["value"]>,
        default: undefined,
    },
});

interface DomainRadioWidgetEmits {
    (event: "update:value", updatedValue: string | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: DomainAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: DomainAliasedNodeData): void;
}

const emit: DomainRadioWidgetEmits = defineEmits([
    "update:value",
    "update:aliasedNodeData",
    "initialized",
]);

const resolvedAliasedNodeData = computed(
    () =>
        aliasedNodeData ??
        buildDomainAliasedNodeData(
            value ?? null,
            cardXNodeXWidgetData?.node.config.options ?? [],
        ),
);

function onUpdateAliasedNodeData(
    updatedAliasedNodeData: DomainAliasedNodeData,
) {
    emit("update:aliasedNodeData", updatedAliasedNodeData);
    emit("update:value", updatedAliasedNodeData.node_value);
}
</script>

<template>
    <DomainRadioWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="resolvedAliasedNodeData"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <DomainRadioWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
