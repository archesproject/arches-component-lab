<script setup lang="ts">
const { value } = defineProps<{ value: string | null }>();
</script>

<template>
    <div>{{ value }}</div>
</template>
