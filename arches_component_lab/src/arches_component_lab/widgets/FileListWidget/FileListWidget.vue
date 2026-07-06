<script setup lang="ts">
import { computed } from "vue";

import FileListWidgetViewer from "@/arches_component_lab/widgets/FileListWidget/components/FileListWidgetViewer.vue";
import FileListWidgetEditor from "@/arches_component_lab/widgets/FileListWidget/components/FileListWidgetEditor/FileListWidgetEditor.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type {
    FileListAliasedNodeData,
    FileReference,
} from "@/arches_component_lab/datatypes/file-list/types.ts";
import type { FileListWidgetProps } from "./types.ts";

const { aliasedNodeData, value } = defineProps<FileListWidgetProps>();

const emit = defineEmits<{
    "update:value": [updatedValue: FileReference[]];
    "update:aliasedNodeData": [updatedValue: FileListAliasedNodeData];
    initialized: [updatedValue: FileListAliasedNodeData];
}>();

// aliasedNodeData !== undefined means the caller passed it (even if null);
// undefined means the prop was omitted, so fall back to the raw value.
const resolvedNodeValue = computed<FileReference[] | null>(() => {
    if (aliasedNodeData !== undefined) {
        return aliasedNodeData?.node_value ?? null;
    }
    return value ?? null;
});
</script>

<template>
    <FileListWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
        @initialized="emit('initialized', $event)"
    />
    <FileListWidgetViewer
        v-if="mode === VIEW"
        :value="resolvedNodeValue"
    />
</template>
