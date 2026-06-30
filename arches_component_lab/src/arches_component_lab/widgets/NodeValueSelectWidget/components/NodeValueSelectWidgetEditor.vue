<script setup lang="ts">
import { onMounted } from "vue";
import InputText from "primevue/inputtext";

import type { NodeValueAliasedNodeData } from "@/arches_component_lab/datatypes/node-value/types.ts";

const { value } = defineProps<{ value: string | null }>();

const emit = defineEmits<{
    (event: "initialized", updatedValue: NodeValueAliasedNodeData): void;
}>();

onMounted(() => {
    emit("initialized", {
        node_value: value,
        display_value: value ?? "",
        details: [],
    });
});
</script>

<template>
    <InputText
        disabled
        type="text"
        :fluid="true"
        :model-value="value ?? ''"
    />
</template>
