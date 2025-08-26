<script setup lang="ts">
import { ref } from "vue";

import Checkbox from 'primevue/checkbox';

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { DomainValue, DomainOption } from "@/arches_component_lab/datatypes/domain/types.ts";

const props = defineProps<{
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    nodeAlias: string;
    aliasedNodeData: DomainValue;
}>();

const options = ref<DomainOption[]>(props.cardXNodeXWidgetData.node.config.options);

const emit = defineEmits<{
    (event: "update:value", updatedValue: DomainValue): void;
}>();

function onUpdateModelValue(updatedValue: string | undefined) {
    if (updatedValue === undefined) {
        updatedValue = "";
    }

    emit("update:value", {
        display_value: updatedValue,
        node_value: updatedValue,
        details: [],
    });
}
</script>

<template>
    <div class="flex flex-wrap gap-4">
        <div v-for="option of options" :key="option.id" class="flex items-center gap-2">
            <Checkbox
                :input-id="option.id"
                name="option"
                :model-value="option.id"
                @update:model-value="onUpdateModelValue($event)"
            />
            <label :for="option.id">{{ option.text }}</label>
        </div>
    </div>
</template>
