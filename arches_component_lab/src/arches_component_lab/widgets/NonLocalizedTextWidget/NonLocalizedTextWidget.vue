<script setup lang="ts">
import { computed } from "vue";

import NonLocalizedTextWidgetEditor from "@/arches_component_lab/widgets/NonLocalizedTextWidget/components/NonLocalizedTextWidgetEditor.vue";
import NonLocalizedTextWidgetViewer from "@/arches_component_lab/widgets/NonLocalizedTextWidget/components/NonLocalizedTextWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { NonLocalizedTextAliasedNodeData } from "@/arches_component_lab/datatypes/non-localized-text/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

const { aliasedNodeData, value } = defineProps<{
    mode: WidgetMode;
    nodeAlias?: string;
    graphSlug?: string;
    cardXNodeXWidgetData?: CardXNodeXWidgetData;
    aliasedNodeData?: NonLocalizedTextAliasedNodeData | null;
    value?: string | null;
    renderContext?: string;
}>();

const emit = defineEmits<{
    "update:value": [updatedValue: string | null];
    "update:aliasedNodeData": [updatedValue: NonLocalizedTextAliasedNodeData];
    initialized: [updatedValue: NonLocalizedTextAliasedNodeData];
}>();

// aliasedNodeData !== undefined means the caller passed it (even if null);
// undefined means the prop was omitted, so fall back to the raw value.
const resolvedNodeValue = computed<string | null>(() => {
    if (aliasedNodeData !== undefined) {
        return aliasedNodeData?.node_value ?? null;
    }
    return value ?? null;
});
</script>

<template>
    <NonLocalizedTextWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
        :render-context="renderContext"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
        @initialized="emit('initialized', $event)"
    />
    <NonLocalizedTextWidgetViewer
        v-if="mode === VIEW"
        :value="resolvedNodeValue"
    />
</template>
