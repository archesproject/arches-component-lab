<script setup lang="ts">
import { computed } from "vue";

import DomainCheckboxWidgetEditor from "@/arches_component_lab/widgets/DomainCheckboxWidget/components/DomainCheckboxWidgetEditor.vue";
import DomainCheckboxWidgetViewer from "@/arches_component_lab/widgets/DomainCheckboxWidget/components/DomainCheckboxWidgetViewer.vue";

import { buildDomainListAliasedNodeData } from "@/arches_component_lab/datatypes/domain/utils.ts";
import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { PropType } from "vue";
import type { DomainListAliasedNodeData } from "@/arches_component_lab/datatypes/domain/types.ts";
import type { DomainCheckboxWidgetProps } from "@/arches_component_lab/widgets/DomainCheckboxWidget/types.ts";

const { aliasedNodeData, cardXNodeXWidgetData, value } = defineProps({
    mode: {
        type: String as PropType<DomainCheckboxWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<DomainCheckboxWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<DomainCheckboxWidgetProps["graphSlug"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<
            DomainCheckboxWidgetProps["cardXNodeXWidgetData"]
        >,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<DomainCheckboxWidgetProps["aliasedNodeData"]>,
        default: undefined,
    },
    value: {
        type: Array as PropType<DomainCheckboxWidgetProps["value"]>,
        default: undefined,
    },
});

interface DomainCheckboxWidgetEmits {
    (event: "update:value", updatedValue: string[] | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: DomainListAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: DomainListAliasedNodeData): void;
}

const emit: DomainCheckboxWidgetEmits = defineEmits([
    "update:value",
    "update:aliasedNodeData",
    "initialized",
]);

const resolvedAliasedNodeData = computed(
    () =>
        aliasedNodeData ??
        buildDomainListAliasedNodeData(
            value ?? null,
            cardXNodeXWidgetData?.node.config.options ?? [],
        ),
);

function onUpdateAliasedNodeData(
    updatedAliasedNodeData: DomainListAliasedNodeData,
) {
    emit("update:aliasedNodeData", updatedAliasedNodeData);
    emit("update:value", updatedAliasedNodeData.node_value);
}
</script>

<template>
    <DomainCheckboxWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="resolvedAliasedNodeData"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <DomainCheckboxWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
