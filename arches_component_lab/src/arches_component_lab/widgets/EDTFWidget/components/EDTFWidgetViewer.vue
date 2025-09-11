<script setup lang="ts">
import type { EdtfValue } from "@/arches_component_lab/datatypes/edtf/types";

defineProps<{
    aliasedNodeData: EdtfValue;
}>();
</script>

<template>
    <div>{{ aliasedNodeData?.display_value }}</div>
</template>
