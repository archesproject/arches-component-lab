<script setup lang="ts">
import arches from "arches";
import type { ConceptOption } from "@/arches_component_lab/widgets/types.ts";

const props = defineProps<{
    value?: ConceptOption | null | undefined;
}>();
</script>
<template>
    <div :key="props.value?.id">
        <a :href="`${arches.urls.resource_editor}${props.value?.id}`">
            {{ props.value?.text }}
        </a>
    </div>
</template>
