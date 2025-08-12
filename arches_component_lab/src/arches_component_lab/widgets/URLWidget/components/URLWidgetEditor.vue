<script setup lang="ts">
import InputText from "primevue/inputtext";

import type { URLValue } from "@/arches_component_lab/datatypes/url/types";

defineProps<{
    nodeAlias: string;
    value: URLValue;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: URLValue): void;
}>();

function onUpdateModelValue(updatedValue: string | undefined) {
    emit("update:value", {
        display_value: updatedValue ?? "",
        node_value: updatedValue ?? ("" as any),
        details: [],
    });
}
</script>

<template>
    <InputText
        type="text"
        :fluid="true"
        :model-value="value.node_value?.url"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
