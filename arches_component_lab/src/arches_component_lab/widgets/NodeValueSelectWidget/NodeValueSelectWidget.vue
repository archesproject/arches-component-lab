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
    value: string | null;
}>();

const emit = defineEmits(["update:value"]);
</script>

<template>
    <NodeValueSelectWidgetEditor
        v-if="mode === EDIT"
        :value="value"
        @update:value="emit('update:value', $event)"
    />
    <NodeValueSelectWidgetViewer
        v-if="mode === VIEW"
        :value="value"
    />
</template>
