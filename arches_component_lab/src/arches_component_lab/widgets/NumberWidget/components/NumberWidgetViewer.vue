<script setup lang="ts">
defineProps<{ value: number | null }>();
</script>

<template>
    <div>{{ value }}</div>
</template>
