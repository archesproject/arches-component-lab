<script setup lang="ts">
import DomainMultiselectWidgetEditor from "@/arches_component_lab/widgets/DomainMultiselectWidget/components/DomainMultiselectWidgetEditor.vue";
import DomainMultiselectWidgetViewer from "@/arches_component_lab/widgets/DomainMultiselectWidget/components/DomainMultiselectWidgetViewer.vue";

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
    <DomainMultiselectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
        :value="value"
        @update:value="emit('update:value', $event)"
        @update:is-dirty="emit('update:isDirty', $event)"
    />
    <DomainMultiselectWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="value"
    />
</template>
