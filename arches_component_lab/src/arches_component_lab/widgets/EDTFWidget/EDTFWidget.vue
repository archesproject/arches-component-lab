<script setup lang="ts">
import EdtfWidgetEditor from "@/arches_component_lab/widgets/EdtfWidget/components/EDTFWidgetEditor.vue";
import EdtfWidgetViewer from "@/arches_component_lab/widgets/EdtfWidget/components/EDTFWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { EdtfValue } from "@/arches_component_lab/datatypes/edtf/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    aliasedNodeData: EdtfValue;
}>();

const emit = defineEmits(["update:isDirty", "update:value"]);
</script>

<template>
    <EdtfWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
        :aliased-node-data="aliasedNodeData"
        @update:value="emit('update:value', $event)"
        @update:is-dirty="emit('update:isDirty', $event)"
    />
    <EdtfWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="aliasedNodeData"
    />
</template>
