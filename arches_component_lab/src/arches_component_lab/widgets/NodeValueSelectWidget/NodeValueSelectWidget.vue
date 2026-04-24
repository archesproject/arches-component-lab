<script setup lang="ts">
import NodeValueSelectWidgetEditor from "@/arches_component_lab/widgets/NodeValueSelectWidget/components/NodeValueSelectWidgetEditor.vue";
import NodeValueSelectWidgetViewer from "@/arches_component_lab/widgets/NodeValueSelectWidget/components/NodeValueSelectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    nodeValue: string | null;
}>();

const emit = defineEmits(["update:value"]);
</script>

<template>
    <NodeValueSelectWidgetEditor
        v-if="mode === EDIT"
        :node-value="nodeValue"
        @update:value="emit('update:value', $event)"
    />
    <NodeValueSelectWidgetViewer
        v-if="mode === VIEW"
        :node-value="nodeValue"
    />
</template>
