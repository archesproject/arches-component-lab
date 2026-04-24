<script setup lang="ts">
import { computed } from "vue";

import type {
    DomainDatatypeCardXNodeXWidgetData,
    DomainOption,
} from "@/arches_component_lab/datatypes/domain/types.ts";

const { nodeValue, cardXNodeXWidgetData } = defineProps<{
    nodeValue: string[] | null;
    cardXNodeXWidgetData: DomainDatatypeCardXNodeXWidgetData;
}>();

const displayValue = computed(
    () =>
        nodeValue
            ?.map(
                (id) =>
                    cardXNodeXWidgetData.node.config.options.find(
                        (o: DomainOption) => o.id === id,
                    )?.text,
            )
            .filter(Boolean)
            .join(", ") ?? null,
);
</script>

<template>
    <div>{{ displayValue }}</div>
</template>
