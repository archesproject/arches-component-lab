<script setup lang="ts">
defineProps<{ value: string | null }>();
</script>

<template>
    <div>{{ value }}</div>
</template>
