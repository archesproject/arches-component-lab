<script setup lang="ts">
import { computed } from "vue";

import URLWidgetEditor from "@/arches_component_lab/widgets/URLWidget/components/URLWidgetEditor.vue";
import URLWidgetViewer from "@/arches_component_lab/widgets/URLWidget/components/URLWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";
import { buildURLAliasedNodeData } from "@/arches_component_lab/datatypes/url/utils.ts";

import type { PropType } from "vue";
import type {
    URLAliasedNodeData,
    URLNodeValue,
} from "@/arches_component_lab/datatypes/url/types.ts";
import type { URLWidgetProps } from "@/arches_component_lab/widgets/URLWidget/types.ts";

const { aliasedNodeData, value } = defineProps({
    mode: {
        type: String as PropType<URLWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<URLWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<URLWidgetProps["graphSlug"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<URLWidgetProps["cardXNodeXWidgetData"]>,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<URLWidgetProps["aliasedNodeData"]>,
        default: undefined,
    },
    value: {
        type: Object as PropType<URLWidgetProps["value"]>,
        default: undefined,
    },
});

interface URLWidgetEmits {
    (event: "update:value", updatedValue: URLNodeValue | null): void;
    (event: "update:aliasedNodeData", updatedValue: URLAliasedNodeData): void;
    (event: "initialized", updatedValue: URLAliasedNodeData): void;
}

const emit: URLWidgetEmits = defineEmits([
    "update:value",
    "update:aliasedNodeData",
    "initialized",
]);

const resolvedAliasedNodeData = computed(
    () => aliasedNodeData ?? buildURLAliasedNodeData(value ?? null),
);

function onUpdateAliasedNodeData(updatedAliasedNodeData: URLAliasedNodeData) {
    emit("update:aliasedNodeData", updatedAliasedNodeData);
    emit("update:value", updatedAliasedNodeData.node_value);
}
</script>

<template>
    <URLWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="resolvedAliasedNodeData"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <URLWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
