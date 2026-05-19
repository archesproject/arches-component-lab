<script setup lang="ts">
import InputText from "primevue/inputtext";

defineProps<{ value: string | null }>();
</script>

<template>
    <InputText
        disabled
        type="text"
        :fluid="true"
        :model-value="value ?? ''"
    />
</template>
