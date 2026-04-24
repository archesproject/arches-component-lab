<script setup lang="ts">
import ResourceInstanceMultiselectWidgetEditor from "@/arches_component_lab/widgets/ResourceInstanceMultiselectWidget/components/ResourceInstanceMultiselectWidgetEditor.vue";
import ResourceInstanceMultiselectWidgetViewer from "@/arches_component_lab/widgets/ResourceInstanceMultiselectWidget/components/ResourceInstanceMultiselectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { ResourceInstanceReference } from "@/arches_component_lab/datatypes/resource-instance-list/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    nodeValue: ResourceInstanceReference[] | null;
}>();

const emit = defineEmits(["update:isLoading", "update:value"]);
</script>

<template>
    <ResourceInstanceMultiselectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
        :node-value="nodeValue"
        @update:is-loading="emit('update:isLoading', $event)"
        @update:value="emit('update:value', $event)"
    />
    <ResourceInstanceMultiselectWidgetViewer
        v-if="mode === VIEW"
        :node-value="nodeValue"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
    />
</template>
