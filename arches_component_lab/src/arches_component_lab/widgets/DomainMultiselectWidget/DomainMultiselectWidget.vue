<script setup lang="ts">
import { computed } from "vue";

import DomainMultiselectWidgetEditor from "@/arches_component_lab/widgets/DomainMultiselectWidget/components/DomainMultiselectWidgetEditor.vue";
import DomainMultiselectWidgetViewer from "@/arches_component_lab/widgets/DomainMultiselectWidget/components/DomainMultiselectWidgetViewer.vue";

import { buildDomainListAliasedNodeData } from "@/arches_component_lab/datatypes/domain/utils.ts";
import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { PropType } from "vue";
import type { DomainListAliasedNodeData } from "@/arches_component_lab/datatypes/domain/types.ts";
import type { DomainMultiselectWidgetProps } from "@/arches_component_lab/widgets/DomainMultiselectWidget/types.ts";

const { aliasedNodeData, cardXNodeXWidgetData, value } = defineProps({
    mode: {
        type: String as PropType<DomainMultiselectWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<DomainMultiselectWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<DomainMultiselectWidgetProps["graphSlug"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<
            DomainMultiselectWidgetProps["cardXNodeXWidgetData"]
        >,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<
            DomainMultiselectWidgetProps["aliasedNodeData"]
        >,
        default: undefined,
    },
    value: {
        type: Array as PropType<DomainMultiselectWidgetProps["value"]>,
        default: undefined,
    },
});

interface DomainMultiselectWidgetEmits {
    (event: "update:value", updatedValue: string[] | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: DomainListAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: DomainListAliasedNodeData): void;
}

const emit: DomainMultiselectWidgetEmits = defineEmits([
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
    <DomainMultiselectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="resolvedAliasedNodeData"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <DomainMultiselectWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
