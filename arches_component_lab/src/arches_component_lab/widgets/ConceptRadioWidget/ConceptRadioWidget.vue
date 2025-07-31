<script setup lang="ts">
import ConceptRadioWidgetEditor from "@/arches_component_lab/widgets/ConceptRadioWidget/components/ConceptRadioWidgetEditor.vue";
import ConceptRadioWidgetViewer from "@/arches_component_lab/widgets/ConceptRadioWidget/components/ConceptRadioWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { ConceptValue } from "@/arches_component_lab/datatypes/concept/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

const props = withDefaults(
    defineProps<{
        mode: WidgetMode;
        nodeAlias: string;
        graphSlug: string;
        cardXNodeXWidgetData?: CardXNodeXWidgetData;
        value?: string | ConceptValue | null;
        groupDirection?: string;
    }>(),
    {
        groupDirection: "column",
        value: null,
        cardXNodeXWidgetData: undefined,
    },
);

const emit = defineEmits(["update:isDirty", "update:value"]);
</script>

<template>
    <ConceptRadioWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="props.cardXNodeXWidgetData"
        :graph-slug="props.graphSlug"
        :node-alias="props.nodeAlias"
        :value="props.value"
        :group-direction="props.groupDirection"
        @update:value="emit('update:value', $event)"
        @update:is-dirty="emit('update:isDirty', $event)"
    />
    <ConceptRadioWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="props.value"
    />
</template>

<style scoped>
.widget {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
}
</style>
