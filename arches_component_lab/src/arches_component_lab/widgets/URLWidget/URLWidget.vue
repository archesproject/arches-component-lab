<script setup lang="ts">
import { computed } from "vue";

import URLWidgetEditor from "@/arches_component_lab/widgets/URLWidget/components/URLWidgetEditor.vue";
import URLWidgetViewer from "@/arches_component_lab/widgets/URLWidget/components/URLWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type {
    URLAliasedNodeData,
    URLNodeValue,
} from "@/arches_component_lab/datatypes/url/types.ts";
import type { URLWidgetProps } from "./types.ts";

const { aliasedNodeData, value } = defineProps<URLWidgetProps>();

const emit = defineEmits<{
    "update:value": [updatedValue: URLNodeValue];
    "update:aliasedNodeData": [updatedValue: URLAliasedNodeData];
    initialized: [updatedValue: URLAliasedNodeData];
}>();

// aliasedNodeData !== undefined means the caller passed it (even if null);
// undefined means the prop was omitted, so fall back to the raw value.
const resolvedNodeValue = computed<URLNodeValue | null>(() => {
    if (aliasedNodeData !== undefined) {
        return aliasedNodeData?.node_value ?? null;
    }
    return value ?? null;
});
</script>

<template>
    <URLWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
        @initialized="emit('initialized', $event)"
    />
    <URLWidgetViewer
        v-if="mode === VIEW"
        :value="resolvedNodeValue"
    />
</template>
