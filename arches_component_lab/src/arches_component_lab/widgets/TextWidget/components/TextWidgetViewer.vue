<script setup lang="ts">
import { onMounted } from "vue";

import type { StringAliasedNodeData } from "@/arches_component_lab/datatypes/string/types";

const { aliasedNodeData } = defineProps(["aliasedNodeData"]) as {
    aliasedNodeData: StringAliasedNodeData;
};

const emit = defineEmits(["initialized"]) as {
    (event: "initialized", updatedValue: StringAliasedNodeData): void;
};

onMounted(() => {
    emit("initialized", aliasedNodeData);
});
</script>

<template>
    <div>{{ aliasedNodeData?.display_value }}</div>
</template>
