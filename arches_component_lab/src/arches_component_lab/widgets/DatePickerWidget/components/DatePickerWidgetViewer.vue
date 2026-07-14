<script setup lang="ts">
import { onMounted } from "vue";

import type { PropType } from "vue";
import type { DateAliasedNodeData } from "@/arches_component_lab/datatypes/date/types.ts";

interface DatePickerWidgetViewerProps {
    aliasedNodeData: DateAliasedNodeData;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<
            DatePickerWidgetViewerProps["aliasedNodeData"]
        >,
        required: true,
    },
});

interface DatePickerWidgetViewerEmits {
    (event: "initialized", updatedValue: DateAliasedNodeData): void;
}

const emit: DatePickerWidgetViewerEmits = defineEmits(["initialized"]);

onMounted(() => {
    emit("initialized", aliasedNodeData);
});
</script>

<template>
    <div>{{ aliasedNodeData?.display_value }}</div>
</template>
