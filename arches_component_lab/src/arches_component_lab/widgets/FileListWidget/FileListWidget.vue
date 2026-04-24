<script setup lang="ts">
import FileListWidgetViewer from "@/arches_component_lab/widgets/FileListWidget/components/FileListWidgetViewer.vue";
import FileListWidgetEditor from "@/arches_component_lab/widgets/FileListWidget/components/FileListWidgetEditor/FileListWidgetEditor.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type {
    FileListCardXNodeXWidgetData,
    FileReference,
} from "@/arches_component_lab/datatypes/file-list/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: FileListCardXNodeXWidgetData;
    nodeValue: FileReference[] | null;
}>();

const emit = defineEmits(["update:value"]);
</script>

<template>
    <FileListWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :node-value="nodeValue"
        @update:value="emit('update:value', $event)"
    />
    <FileListWidgetViewer
        v-if="mode === VIEW"
        :node-value="nodeValue"
    />
</template>
