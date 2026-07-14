<script setup lang="ts">
import { onMounted } from "vue";

import type { PropType } from "vue";
import type { DomainListAliasedNodeData } from "@/arches_component_lab/datatypes/domain/types.ts";

interface DomainMultiselectWidgetViewerProps {
    aliasedNodeData: DomainListAliasedNodeData;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<
            DomainMultiselectWidgetViewerProps["aliasedNodeData"]
        >,
        required: true,
    },
});

interface DomainMultiselectWidgetViewerEmits {
    (event: "initialized", updatedValue: DomainListAliasedNodeData): void;
}

const emit: DomainMultiselectWidgetViewerEmits = defineEmits(["initialized"]);

onMounted(() => {
    emit("initialized", aliasedNodeData);
});
</script>

<template>
    <div>{{ aliasedNodeData?.display_value }}</div>
</template>
