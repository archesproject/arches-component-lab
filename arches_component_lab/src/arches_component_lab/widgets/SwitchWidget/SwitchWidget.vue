<script setup lang="ts">
import { computed } from "vue";

import SwitchWidgetEditor from "@/arches_component_lab/widgets/SwitchWidget/components/SwitchWidgetEditor.vue";
import SwitchWidgetViewer from "@/arches_component_lab/widgets/SwitchWidget/components/SwitchWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { BooleanCardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { BooleanAliasedNodeData } from "@/arches_component_lab/datatypes/boolean/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

const { aliasedNodeData, value } = defineProps<{
    mode: WidgetMode;
    nodeAlias?: string;
    graphSlug?: string;
    cardXNodeXWidgetData?: BooleanCardXNodeXWidgetData;
    aliasedNodeData?: BooleanAliasedNodeData | null;
    value?: boolean | null;
}>();

const emit = defineEmits<{
    "update:value": [updatedValue: boolean | null];
    "update:aliasedNodeData": [updatedValue: BooleanAliasedNodeData];
}>();

// aliasedNodeData !== undefined means the caller passed it (even if null);
// undefined means the prop was omitted, so fall back to the raw value.
const resolvedNodeValue = computed<boolean | null>(() => {
    if (aliasedNodeData !== undefined) {
        return aliasedNodeData?.node_value ?? null;
    }
    return value ?? null;
});
</script>

<template>
    <SwitchWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
        @update:value="emit('update:value', $event)"
        @update:aliased-node-data="emit('update:aliasedNodeData', $event)"
    />
    <SwitchWidgetViewer
        v-if="mode === VIEW"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :value="resolvedNodeValue"
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
