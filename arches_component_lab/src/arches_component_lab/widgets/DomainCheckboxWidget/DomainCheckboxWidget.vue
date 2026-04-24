<script setup lang="ts">
import DomainCheckboxWidgetEditor from "@/arches_component_lab/widgets/DomainCheckboxWidget/components/DomainCheckboxWidgetEditor.vue";
import DomainCheckboxWidgetViewer from "@/arches_component_lab/widgets/DomainCheckboxWidget/components/DomainCheckboxWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { DomainDatatypeCardXNodeXWidgetData } from "@/arches_component_lab/datatypes/domain/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: DomainDatatypeCardXNodeXWidgetData;
    nodeValue: string[] | null;
}>();

const emit = defineEmits(["update:value"]);
</script>

<template>
    <DomainCheckboxWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :node-value="nodeValue"
        @update:value="emit('update:value', $event)"
    />
    <DomainCheckboxWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :node-value="nodeValue"
    />
</template>
