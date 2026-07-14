<script setup lang="ts">
import { onMounted } from "vue";
import InputText from "primevue/inputtext";

import { buildNodeValueAliasedNodeData } from "@/arches_component_lab/datatypes/node-value/utils.ts";

import type { PropType } from "vue";
import type { NodeValueAliasedNodeData } from "@/arches_component_lab/datatypes/node-value/types.ts";

interface NodeValueSelectWidgetEditorProps {
    aliasedNodeData: NodeValueAliasedNodeData | null;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<
            NodeValueSelectWidgetEditorProps["aliasedNodeData"]
        >,
        required: true,
    },
});

interface NodeValueSelectWidgetEditorEmits {
    (
        event: "update:aliasedNodeData",
        updatedValue: NodeValueAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: NodeValueAliasedNodeData): void;
}

const emit: NodeValueSelectWidgetEditorEmits = defineEmits([
    "update:aliasedNodeData",
    "initialized",
]);

onMounted(() => {
    emit("initialized", aliasedNodeData ?? buildNodeValueAliasedNodeData(null));
});
</script>

<template>
    <InputText
        disabled
        type="text"
        :fluid="true"
        :model-value="aliasedNodeData?.node_value ?? ''"
    />
</template>
