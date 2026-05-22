<script setup lang="ts">
import { computed } from "vue";

import LanguageSelectWidgetEditor from "@/arches_component_lab/widgets/LanguageSelectWidget/components/LanguageSelectWidgetEditor.vue";
import LanguageSelectWidgetViewer from "@/arches_component_lab/widgets/LanguageSelectWidget/components/LanguageSelectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { LanguageAliasedNodeData } from "@/arches_component_lab/datatypes/language/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

const { aliasedNodeData, value } = defineProps<{
    mode: WidgetMode;
    nodeAlias?: string;
    graphSlug?: string;
    cardXNodeXWidgetData?: CardXNodeXWidgetData;
    aliasedNodeData?: LanguageAliasedNodeData | null;
    value?: string | null;
}>();

const emit = defineEmits<{
    "update:isLoading": [isLoading: boolean];
    "update:value": [updatedValue: string | null];
    "update:aliasedNodeData": [updatedValue: LanguageAliasedNodeData];
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
    <LanguageSelectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
        @update:is-loading="emit('update:isLoading', $event)"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
    />
    <LanguageSelectWidgetViewer
        v-if="mode === VIEW"
        :value="resolvedNodeValue"
    />
</template>
