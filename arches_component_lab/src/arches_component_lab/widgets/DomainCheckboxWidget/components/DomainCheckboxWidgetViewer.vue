<script setup lang="ts">
import { computed } from "vue";

import type {
    DomainDatatypeCardXNodeXWidgetData,
    DomainOption,
} from "@/arches_component_lab/datatypes/domain/types.ts";

const { value, cardXNodeXWidgetData } = defineProps<{
    value: string[] | null;
    cardXNodeXWidgetData: DomainDatatypeCardXNodeXWidgetData;
}>();

const displayValue = computed(
    () =>
        value
            ?.map(
                (id) =>
                    cardXNodeXWidgetData.node.config.options.find(
                        (option: DomainOption) => option.id === id,
                    )?.text,
            )
            .filter(Boolean)
            .join(", ") ?? null,
);
</script>

<template>
    <div>{{ displayValue }}</div>
</template>
