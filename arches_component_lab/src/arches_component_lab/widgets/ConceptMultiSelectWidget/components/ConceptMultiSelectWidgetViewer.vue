<script setup lang="ts">
import type { ConceptOption } from "@/arches_component_lab/widgets/types.ts";

import type { CardXNodeXWidget } from "@/arches_component_lab/types.ts";

const props = defineProps<{
    value: ConceptOption[] | null | undefined;
    cardXNodeXWidgetData?: CardXNodeXWidget;
}>();
</script>
<template>
    <div
        v-for="resourceInstance in props.value"
        :key="resourceInstance.id"
    >
        {{ resourceInstance.text }}
    </div>
</template>
