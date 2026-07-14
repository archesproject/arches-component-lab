<script setup lang="ts">
import { computed } from "vue";

import DomainSelectWidgetEditor from "@/arches_component_lab/widgets/DomainSelectWidget/components/DomainSelectWidgetEditor.vue";
import DomainSelectWidgetViewer from "@/arches_component_lab/widgets/DomainSelectWidget/components/DomainSelectWidgetViewer.vue";

import { buildDomainAliasedNodeData } from "@/arches_component_lab/datatypes/domain/utils.ts";
import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { PropType } from "vue";
import type { DomainAliasedNodeData } from "@/arches_component_lab/datatypes/domain/types.ts";
import type { DomainSelectWidgetProps } from "@/arches_component_lab/widgets/DomainSelectWidget/types.ts";

const { aliasedNodeData, cardXNodeXWidgetData, value } = defineProps({
    mode: {
        type: String as PropType<DomainSelectWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<DomainSelectWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<DomainSelectWidgetProps["graphSlug"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<
            DomainSelectWidgetProps["cardXNodeXWidgetData"]
        >,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<DomainSelectWidgetProps["aliasedNodeData"]>,
        default: undefined,
    },
    value: {
        type: String as PropType<DomainSelectWidgetProps["value"]>,
        default: undefined,
    },
});

interface DomainSelectWidgetEmits {
    (event: "update:value", updatedValue: string | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: DomainAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: DomainAliasedNodeData): void;
}

const emit: DomainSelectWidgetEmits = defineEmits([
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
    <DomainSelectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="resolvedAliasedNodeData"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <DomainSelectWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
