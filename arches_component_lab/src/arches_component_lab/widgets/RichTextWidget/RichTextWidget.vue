<script setup lang="ts">
import { computed } from "vue";

import { useGettext } from "vue3-gettext";

import RichTextWidgetEditor from "@/arches_component_lab/widgets/RichTextWidget/components/RichTextWidgetEditor/RichTextWidgetEditor.vue";
import RichTextWidgetViewer from "@/arches_component_lab/widgets/RichTextWidget/components/RichTextWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";
import { buildStringAliasedNodeData } from "@/arches_component_lab/datatypes/string/utils.ts";

import type { PropType } from "vue";
import type {
    LanguageValue,
    StringAliasedNodeData,
} from "@/arches_component_lab/datatypes/string/types.ts";
import type { RichTextWidgetProps } from "@/arches_component_lab/widgets/RichTextWidget/types.ts";

const { aliasedNodeData, value } = defineProps({
    mode: {
        type: String as PropType<RichTextWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<RichTextWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<RichTextWidgetProps["graphSlug"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<RichTextWidgetProps["cardXNodeXWidgetData"]>,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<RichTextWidgetProps["aliasedNodeData"]>,
        default: undefined,
    },
    value: {
        type: Object as PropType<RichTextWidgetProps["value"]>,
        default: undefined,
    },
});

interface RichTextWidgetEmits {
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

const emit: RichTextWidgetEmits = defineEmits([
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
    <RichTextWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="resolvedAliasedNodeData"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <RichTextWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
