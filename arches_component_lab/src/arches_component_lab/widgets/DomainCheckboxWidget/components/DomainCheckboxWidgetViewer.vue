<script setup lang="ts">
import { onMounted } from "vue";

import type { PropType } from "vue";
import type { DomainListAliasedNodeData } from "@/arches_component_lab/datatypes/domain/types.ts";

interface DomainCheckboxWidgetViewerProps {
    aliasedNodeData: DomainListAliasedNodeData;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<
            DomainCheckboxWidgetViewerProps["aliasedNodeData"]
        >,
        required: true,
    },
});

interface DomainCheckboxWidgetViewerEmits {
    (event: "initialized", updatedValue: DomainListAliasedNodeData): void;
}

const emit: DomainCheckboxWidgetViewerEmits = defineEmits(["initialized"]);

onMounted(() => {
    emit("initialized", aliasedNodeData);
});
</script>

<template>
    <div>{{ aliasedNodeData?.display_value }}</div>
</template>
