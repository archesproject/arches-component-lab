<script setup lang="ts">
import { onMounted } from "vue";

import type { PropType } from "vue";
import type { DomainAliasedNodeData } from "@/arches_component_lab/datatypes/domain/types.ts";

interface DomainRadioWidgetViewerProps {
    aliasedNodeData: DomainAliasedNodeData;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<
            DomainRadioWidgetViewerProps["aliasedNodeData"]
        >,
        required: true,
    },
});

interface DomainRadioWidgetViewerEmits {
    (event: "initialized", updatedValue: DomainAliasedNodeData): void;
}

const emit: DomainRadioWidgetViewerEmits = defineEmits(["initialized"]);

onMounted(() => {
    emit("initialized", aliasedNodeData);
});
</script>

<template>
    <div>{{ aliasedNodeData?.display_value }}</div>
</template>
