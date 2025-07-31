<script setup lang="ts">
import ConceptMultiSelectWidgetEditor from "@/arches_component_lab/widgets/ConceptMultiselectWidget/components/ConceptMultiselectWidgetEditor.vue";
import ConceptMultiSelectWidgetViewer from "@/arches_component_lab/widgets/ConceptMultiselectWidget/components/ConceptMultiselectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { ConceptListValue } from "@/arches_component_lab/datatypes/concept/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

const props = withDefaults(
    defineProps<{
        mode: WidgetMode;
        nodeAlias: string;
        graphSlug: string;
        cardXNodeXWidgetData: CardXNodeXWidgetData;
        value?: ConceptListValue | string[] | null | undefined;
    }>(),
    {
        cardXNodeXWidgetData: undefined,
        value: undefined,
    },
);

const emit = defineEmits(["update:isDirty", "update:value"]);
</script>

<template>
    <ConceptMultiSelectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="props.cardXNodeXWidgetData"
        :graph-slug="props.graphSlug"
        :node-alias="props.nodeAlias"
        :value="props.value"
        @update:value="emit('update:value', $event)"
        @update:is-dirty="emit('update:isDirty', $event)"
    />
    <ConceptMultiSelectWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="props.cardXNodeXWidgetData"
        :value="props.value"
    />
</template>
