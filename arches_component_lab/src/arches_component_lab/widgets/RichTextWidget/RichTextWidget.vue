<script setup lang="ts">
import RichTextWidgetEditor from "@/arches_component_lab/widgets/RichTextWidget/components/RichTextWidgetEditor/RichTextWidgetEditor.vue";
import RichTextWidgetViewer from "@/arches_component_lab/widgets/RichTextWidget/components/RichTextWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { StringCardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { LanguageValue } from "@/arches_component_lab/datatypes/string/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: StringCardXNodeXWidgetData;
    nodeValue: Record<string, LanguageValue> | null;
}>();

const emit = defineEmits(["update:value"]);
</script>

<template>
    <RichTextWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :node-value="nodeValue"
        @update:value="emit('update:value', $event)"
    />
    <RichTextWidgetViewer
        v-if="mode === VIEW"
        :node-value="nodeValue"
    />
</template>
