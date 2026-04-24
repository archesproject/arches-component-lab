<script setup lang="ts">
import LanguageSelectWidgetEditor from "@/arches_component_lab/widgets/LanguageSelectWidget/components/LanguageSelectWidgetEditor.vue";
import LanguageSelectWidgetViewer from "@/arches_component_lab/widgets/LanguageSelectWidget/components/LanguageSelectWidgetViewer.vue";

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

const emit = defineEmits(["update:isLoading", "update:value"]);
</script>

<template>
    <LanguageSelectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :node-value="nodeValue"
        @update:is-loading="emit('update:isLoading', $event)"
        @update:value="emit('update:value', $event)"
    />
    <LanguageSelectWidgetViewer
        v-if="mode === VIEW"
        :node-value="nodeValue"
    />
</template>
