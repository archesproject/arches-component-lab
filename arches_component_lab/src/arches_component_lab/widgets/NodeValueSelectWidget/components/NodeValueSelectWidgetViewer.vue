<script setup lang="ts">
defineProps<{ nodeValue: string | null }>();
</script>

<template>
    <div>{{ nodeValue }}</div>
</template>
