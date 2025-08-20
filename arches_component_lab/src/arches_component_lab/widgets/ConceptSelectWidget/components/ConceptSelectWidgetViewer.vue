<script setup lang="ts">
import type { ConceptValue } from "@/arches_component_lab/datatypes/concept/types.ts";
import { computed } from "vue";

const { aliasedNodeData } = defineProps<{
    aliasedNodeData: ConceptValue;
}>();

const key = computed(() => {
    return aliasedNodeData.node_value ?? "";
});
</script>
<template>
    <div :key="key">
        {{ aliasedNodeData.display_value }}
    </div>
</template>
