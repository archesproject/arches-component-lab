<script setup lang="ts">
import type { DomainValue } from "@/arches_component_lab/datatypes/domain/types.ts";

defineProps<{
    value: DomainValue;
}>();
</script>

<template>
    <div>{{ value?.display_value }}</div>
</template>
