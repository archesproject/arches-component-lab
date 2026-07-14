<script setup lang="ts">
import { computed } from "vue";

import { useGettext } from "vue3-gettext";

import TextWidgetEditor from "@/arches_component_lab/widgets/TextWidget/components/TextWidgetEditor.vue";
import TextWidgetViewer from "@/arches_component_lab/widgets/TextWidget/components/TextWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";
import { buildStringAliasedNodeData } from "@/arches_component_lab/datatypes/string/utils.ts";

import type { PropType } from "vue";
import type {
    LanguageValue,
    StringAliasedNodeData,
} from "@/arches_component_lab/datatypes/string/types.ts";
import type { TextWidgetProps } from "@/arches_component_lab/widgets/TextWidget/types.ts";

const { aliasedNodeData, value } = defineProps({
    mode: {
        type: String as PropType<TextWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<TextWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<TextWidgetProps["graphSlug"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<TextWidgetProps["cardXNodeXWidgetData"]>,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<TextWidgetProps["aliasedNodeData"]>,
        default: undefined,
    },
    value: {
        type: Object as PropType<TextWidgetProps["value"]>,
        default: undefined,
    },
    renderContext: {
        type: String as PropType<TextWidgetProps["renderContext"]>,
        default: undefined,
    },
});

interface TextWidgetEmits {
    (
        event: "update:value",
        updatedValue: Record<string, LanguageValue> | null,
    ): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: StringAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: StringAliasedNodeData): void;
}

const emit: TextWidgetEmits = defineEmits([
    "update:value",
    "update:aliasedNodeData",
    "initialized",
]);

const { current } = useGettext();
const resolvedAliasedNodeData = computed(
    () => aliasedNodeData ?? buildStringAliasedNodeData(value ?? null, current),
);

function onUpdateAliasedNodeData(
    updatedAliasedNodeData: StringAliasedNodeData,
) {
    emit("update:aliasedNodeData", updatedAliasedNodeData);
    emit("update:value", updatedAliasedNodeData.node_value);
}
</script>

<template>
    <TextWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="resolvedAliasedNodeData"
        :render-context="renderContext"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <TextWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
