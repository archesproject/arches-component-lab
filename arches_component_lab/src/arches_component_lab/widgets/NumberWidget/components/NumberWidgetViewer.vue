<script setup lang="ts">
defineProps<{ nodeValue: number | null }>();
</script>

<template>
    <div>{{ nodeValue }}</div>
</template>
