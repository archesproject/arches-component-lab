<script setup lang="ts">
import { computed } from "vue";

import RichTextWidgetEditor from "@/arches_component_lab/widgets/RichTextWidget/components/RichTextWidgetEditor/RichTextWidgetEditor.vue";
import RichTextWidgetViewer from "@/arches_component_lab/widgets/RichTextWidget/components/RichTextWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { StringCardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type {
    LanguageValue,
    StringAliasedNodeData,
} from "@/arches_component_lab/datatypes/string/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

const { aliasedNodeData, value } = defineProps<{
    mode: WidgetMode;
    nodeAlias?: string;
    graphSlug?: string;
    cardXNodeXWidgetData?: StringCardXNodeXWidgetData;
    aliasedNodeData?: StringAliasedNodeData | null;
    value?: Record<string, LanguageValue> | null;
}>();

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
    <RichTextWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
        @initialized="emit('initialized', $event)"
    />
    <RichTextWidgetViewer
        v-if="mode === VIEW"
        :value="resolvedNodeValue"
        :aliased-node-data="aliasedNodeData ?? null"
    />
</template>
