<script setup lang="ts">
import { computed } from "vue";

import type {
    DomainCardXNodeXWidgetData,
    DomainOption,
} from "@/arches_component_lab/datatypes/domain/types.ts";

const { value, cardXNodeXWidgetData } = defineProps<{
    value: string | null;
    cardXNodeXWidgetData?: DomainCardXNodeXWidgetData;
}>();

const displayValue = computed(
    () =>
        (cardXNodeXWidgetData?.node.config.options ?? []).find(
            (option: DomainOption) => option.id === value,
        )?.text ?? null,
);
</script>

<template>
    <div>{{ displayValue }}</div>
</template>
