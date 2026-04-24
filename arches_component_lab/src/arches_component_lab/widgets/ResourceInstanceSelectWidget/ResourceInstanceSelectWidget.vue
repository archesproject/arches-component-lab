<script setup lang="ts">
import ResourceInstanceSelectWidgetEditor from "@/arches_component_lab/widgets/ResourceInstanceSelectWidget/components/ResourceInstanceSelectWidgetEditor.vue";
import ResourceInstanceSelectWidgetViewer from "@/arches_component_lab/widgets/ResourceInstanceSelectWidget/components/ResourceInstanceSelectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";
import type { ResourceInstanceReference } from "@/arches_component_lab/datatypes/resource-instance/types";

const {
    mode,
    nodeAlias,
    graphSlug,
    cardXNodeXWidgetData,
    nodeValue,
    defaultTerm,
} = defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    nodeValue: ResourceInstanceReference | null;
    defaultTerm?: string;
}>();

const emit = defineEmits(["update:isLoading", "update:value"]);
</script>

<template>
    <ResourceInstanceSelectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
        :node-value="nodeValue"
        :default-term="defaultTerm"
        @update:is-loading="emit('update:isLoading', $event)"
        @update:value="emit('update:value', $event)"
    />
    <ResourceInstanceSelectWidgetViewer
        v-if="mode === VIEW"
        :node-value="nodeValue"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
    />
</template>
