<script setup lang="ts">
import type { ConceptListValue } from "@/arches_component_lab/datatypes/concept-list/types.ts";

defineProps<{
    aliasedNodeData: ConceptListValue;
}>();

</script>
<template>
    <div :key="aliasedNodeData.node_value.join(',')">
        {{ aliasedNodeData.display_value }}
    </div>
</template>
