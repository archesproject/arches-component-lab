<script setup lang="ts">
import type { ConceptOption } from "@/arches_component_lab/widgets/types.ts";

defineProps<{
    value?: ConceptOption | null | undefined;
}>();

</script>
<template>
    <div :key="value?.id">
            {{ value?.text }}
    </div>
</template>
