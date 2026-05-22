<script setup lang="ts">
const { value } = defineProps<{ value: number | null }>();
</script>

<template>
    <div>{{ value }}</div>
</template>
