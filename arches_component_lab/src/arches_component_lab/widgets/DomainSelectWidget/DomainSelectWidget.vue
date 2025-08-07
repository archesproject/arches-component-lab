<script setup lang="ts">
import DomainSelectWidgetEditor from "@/arches_component_lab/widgets/DomainSelectWidget/components/DomainSelectWidgetEditor.vue";
import DomainSelectWidgetViewer from "@/arches_component_lab/widgets/DomainSelectWidget/components/DomainSelectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { DomainValue } from "@/arches_component_lab/datatypes/domain/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    value: DomainValue;
}>();

const emit = defineEmits(["update:isDirty", "update:value"]);
</script>

<template>
    <DomainSelectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
        :value="value"
        @update:value="emit('update:value', $event)"
        @update:is-dirty="emit('update:isDirty', $event)"
    />
    <DomainSelectWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="value"
    />
</template>
