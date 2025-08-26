<script setup lang="ts">
import type { EdtfValue } from "@/arches_component_lab/datatypes/edtf/types";
import Inplace from 'primevue/inplace';

defineProps<{
    value: EdtfValue;
}>();
</script>

<template>
    <div>{{ value?.display_value }}</div>
</template>
