<script setup lang="ts">
import { computed } from "vue";

import NonLocalizedTextWidgetEditor from "@/arches_component_lab/widgets/NonLocalizedTextWidget/components/NonLocalizedTextWidgetEditor.vue";
import NonLocalizedTextWidgetViewer from "@/arches_component_lab/widgets/NonLocalizedTextWidget/components/NonLocalizedTextWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";
import { buildNonLocalizedTextAliasedNodeData } from "@/arches_component_lab/datatypes/non-localized-text/utils.ts";

import type { PropType } from "vue";
import type { NonLocalizedTextAliasedNodeData } from "@/arches_component_lab/datatypes/non-localized-text/types.ts";
import type { NonLocalizedTextWidgetProps } from "@/arches_component_lab/widgets/NonLocalizedTextWidget/types.ts";

const { aliasedNodeData, value } = defineProps({
    mode: {
        type: String as PropType<NonLocalizedTextWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<NonLocalizedTextWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<NonLocalizedTextWidgetProps["graphSlug"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<
            NonLocalizedTextWidgetProps["cardXNodeXWidgetData"]
        >,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<
            NonLocalizedTextWidgetProps["aliasedNodeData"]
        >,
        default: undefined,
    },
    value: {
        type: String as PropType<NonLocalizedTextWidgetProps["value"]>,
        default: undefined,
    },
    renderContext: {
        type: String as PropType<NonLocalizedTextWidgetProps["renderContext"]>,
        default: undefined,
    },
});

interface NonLocalizedTextWidgetEmits {
    (event: "update:value", updatedValue: string | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: NonLocalizedTextAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: NonLocalizedTextAliasedNodeData): void;
}

const emit: NonLocalizedTextWidgetEmits = defineEmits([
    "update:value",
    "update:aliasedNodeData",
    "initialized",
]);

const resolvedAliasedNodeData = computed(
    () =>
        aliasedNodeData ?? buildNonLocalizedTextAliasedNodeData(value ?? null),
);

function onUpdateAliasedNodeData(
    updatedAliasedNodeData: NonLocalizedTextAliasedNodeData,
) {
    emit("update:aliasedNodeData", updatedAliasedNodeData);
    emit("update:value", updatedAliasedNodeData.node_value);
}
</script>

<template>
    <NonLocalizedTextWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="resolvedAliasedNodeData"
        :render-context="renderContext"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <NonLocalizedTextWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
