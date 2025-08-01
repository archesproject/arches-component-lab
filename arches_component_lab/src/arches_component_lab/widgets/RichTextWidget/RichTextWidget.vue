<script setup lang="ts">
import RichTextWidgetEditor from "@/arches_component_lab/widgets/RichTextWidget/components/RichTextWidgetEditor.vue";
import RichTextWidgetViewer from "@/arches_component_lab/widgets/RichTextWidget/components/RichTextWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { StringCardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { StringValue } from "@/arches_component_lab/datatypes/string/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: StringCardXNodeXWidgetData;
    value: StringValue;
}>();

const emit = defineEmits(["update:isDirty", "update:value"]);
</script>

<template>
    <RichTextWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
        :value="value"
        @update:value="emit('update:value', $event)"
        @update:is-dirty="emit('update:isDirty', $event)"
    />
    <RichTextWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="value"
    />
</template>
