<script setup lang="ts">
import InputText from "primevue/inputtext";

defineProps<{ nodeValue: string | null }>();
</script>

<template>
    <InputText
        disabled
        type="text"
        :fluid="true"
        :model-value="nodeValue ?? ''"
    />
</template>
