<script setup lang="ts">
import URLWidgetEditor from "@/arches_component_lab/widgets/URLWidget/components/URLWidgetEditor.vue";
import URLWidgetViewer from "@/arches_component_lab/widgets/URLWidget/components/URLWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";
import type { URLNodeValue } from "@/arches_component_lab/datatypes/url/types";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    nodeValue: URLNodeValue | null;
}>();

const emit = defineEmits(["update:value"]);
</script>

<template>
    <URLWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :node-value="nodeValue"
        @update:value="emit('update:value', $event)"
    />
    <URLWidgetViewer
        v-if="mode === VIEW"
        :node-value="nodeValue"
    />
</template>
