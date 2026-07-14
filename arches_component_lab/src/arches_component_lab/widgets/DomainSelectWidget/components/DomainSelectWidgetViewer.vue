<script setup lang="ts">
import { onMounted } from "vue";

import type { PropType } from "vue";
import type { DomainAliasedNodeData } from "@/arches_component_lab/datatypes/domain/types.ts";

interface DomainSelectWidgetViewerProps {
    aliasedNodeData: DomainAliasedNodeData;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<
            DomainSelectWidgetViewerProps["aliasedNodeData"]
        >,
        required: true,
    },
});

interface DomainSelectWidgetViewerEmits {
    (event: "initialized", updatedValue: DomainAliasedNodeData): void;
}

const emit: DomainSelectWidgetViewerEmits = defineEmits(["initialized"]);

onMounted(() => {
    emit("initialized", aliasedNodeData);
});
</script>

<template>
    <div>{{ aliasedNodeData?.display_value }}</div>
</template>
