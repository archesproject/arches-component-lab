<script setup lang="ts">
import { computed } from "vue";

import TextWidgetEditor from "@/arches_component_lab/widgets/TextWidget/components/TextWidgetEditor.vue";
import TextWidgetViewer from "@/arches_component_lab/widgets/TextWidget/components/TextWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type {
    LanguageValue,
    StringAliasedNodeData,
} from "@/arches_component_lab/datatypes/string/types.ts";
import type { TextWidgetProps } from "./types.ts";

const { aliasedNodeData, value } = defineProps<TextWidgetProps>();

const emit = defineEmits<{
    "update:value": [updatedValue: Record<string, LanguageValue>];
    "update:aliasedNodeData": [updatedValue: StringAliasedNodeData];
    initialized: [updatedValue: StringAliasedNodeData];
}>();

// aliasedNodeData !== undefined means the caller passed it (even if null);
// undefined means the prop was omitted, so fall back to the raw value.
const resolvedNodeValue = computed<Record<string, LanguageValue> | null>(() => {
    if (aliasedNodeData !== undefined) {
        return aliasedNodeData?.node_value ?? null;
    }
    return value ?? null;
});
</script>

<template>
    <TextWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
        :render-context="renderContext"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
        @initialized="emit('initialized', $event)"
    />
    <TextWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
        :aliased-node-data="aliasedNodeData ?? null"
    />
</template>
