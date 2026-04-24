<script setup lang="ts">
import DomainSelectWidgetEditor from "@/arches_component_lab/widgets/DomainSelectWidget/components/DomainSelectWidgetEditor.vue";
import DomainSelectWidgetViewer from "@/arches_component_lab/widgets/DomainSelectWidget/components/DomainSelectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { DomainDatatypeCardXNodeXWidgetData } from "@/arches_component_lab/datatypes/domain/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: DomainDatatypeCardXNodeXWidgetData;
    nodeValue: string | null;
}>();

const emit = defineEmits(["update:value"]);
</script>

<template>
    <DomainSelectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :node-value="nodeValue"
        @update:value="emit('update:value', $event)"
    />
    <DomainSelectWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :node-value="nodeValue"
    />
</template>
