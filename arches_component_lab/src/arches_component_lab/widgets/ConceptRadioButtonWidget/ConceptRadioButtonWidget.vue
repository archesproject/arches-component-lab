<script setup lang="ts">
import GenericWidget from "@/arches_component_lab/widgets/components/GenericWidget.vue";
import ConceptRadioButtonWidgetEditor from "@/arches_component_lab/widgets/ConceptRadioButtonWidget/components/ConceptRadioButtonWidgetEditor.vue";
import ConceptRadioButtonWidgetViewer from "@/arches_component_lab/widgets/ConceptRadioButtonWidget/components/ConceptRadioButtonWidgetViewer.vue";

import type { CardXNodeXWidget } from "@/arches_component_lab/types.ts";
import type {
    ConceptOption,
    WidgetMode,
} from "@/arches_component_lab/widgets/types.ts";

const props = defineProps<{
    mode: WidgetMode;
    nodeAlias: string;
    graphSlug: string;
    cardXNodeXWidgetData?: CardXNodeXWidget;
    value?: ConceptOption;
    groupDirection?: string;
    showLabel?: boolean;
}>();

const {
    showLabel = true,
    groupDirection = "column",
    value = null,
    cardXNodeXWidgetData = undefined,
} = props;
const emit = defineEmits(["update:isDirty", "update:value"]);
</script>

<template>
    <GenericWidget
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
        :mode="mode"
        :show-label="showLabel"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
    >
        <template #editor="slotProps">
            <ConceptRadioButtonWidgetEditor
                :card-x-node-x-widget-data="slotProps.cardXNodeXWidgetData"
                :graph-slug="graphSlug"
                :node-alias="nodeAlias"
                :value="value"
                :group-direction="groupDirection"
                @update:value="emit('update:value', $event)"
                @update:is-dirty="emit('update:isDirty', $event)"
            />
        </template>
        <template #viewer="slotProps">
            <ConceptRadioButtonWidgetViewer
                :card-x-node-x-widget-data="slotProps.cardXNodeXWidgetData"
                :value="value"
            />
        </template>
    </GenericWidget>
</template>

<style scoped>
.widget {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
}
</style>
