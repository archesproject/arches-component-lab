<script setup lang="ts">
import { computed } from "vue";

import FileListWidgetViewer from "@/arches_component_lab/widgets/FileListWidget/components/FileListWidgetViewer.vue";
import FileListWidgetEditor from "@/arches_component_lab/widgets/FileListWidget/components/FileListWidgetEditor/FileListWidgetEditor.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";
import { buildFileListAliasedNodeData } from "@/arches_component_lab/datatypes/file-list/utils.ts";

import type { PropType } from "vue";
import type {
    FileListAliasedNodeData,
    FileReference,
} from "@/arches_component_lab/datatypes/file-list/types.ts";
import type { FileListWidgetProps } from "@/arches_component_lab/widgets/FileListWidget/types.ts";

const { aliasedNodeData, value } = defineProps({
    mode: {
        type: String as PropType<FileListWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<FileListWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<FileListWidgetProps["graphSlug"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<FileListWidgetProps["cardXNodeXWidgetData"]>,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<FileListWidgetProps["aliasedNodeData"]>,
        default: undefined,
    },
    value: {
        type: Array as PropType<FileListWidgetProps["value"]>,
        default: undefined,
    },
});

interface FileListWidgetEmits {
    (event: "update:value", updatedValue: FileReference[] | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: FileListAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: FileListAliasedNodeData): void;
}

const emit: FileListWidgetEmits = defineEmits([
    "update:value",
    "update:aliasedNodeData",
    "initialized",
]);

const resolvedAliasedNodeData = computed(
    () => aliasedNodeData ?? buildFileListAliasedNodeData(value ?? null),
);

function onUpdateAliasedNodeData(
    updatedAliasedNodeData: FileListAliasedNodeData,
) {
    emit("update:aliasedNodeData", updatedAliasedNodeData);
    emit("update:value", updatedAliasedNodeData.node_value);
}
</script>

<template>
    <FileListWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="resolvedAliasedNodeData"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <FileListWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
