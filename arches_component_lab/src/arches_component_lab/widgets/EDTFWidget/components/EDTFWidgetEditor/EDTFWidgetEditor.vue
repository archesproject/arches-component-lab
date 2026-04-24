<script setup lang="ts">
import { ref } from "vue";
import { useGettext } from "vue3-gettext";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

import EDTFHelpDrawer from "@/arches_component_lab/widgets/EDTFWidget/components/EDTFWidgetEditor/components/EDTFHelpDrawer.vue";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";

const { $gettext } = useGettext();

const { cardXNodeXWidgetData, nodeValue } = defineProps<{
    cardXNodeXWidgetData: CardXNodeXWidgetData;
    nodeValue: string | null;
}>();

const emit = defineEmits<{
    (event: "update:value", updatedValue: string): void;
}>();

const shouldShowHelpDrawer = ref(false);

function handleUpdateModelValue(updatedValue: string | undefined) {
    emit("update:value", updatedValue ?? "");
}
</script>

<template>
    <div class="field-with-button">
        <InputText
            class="flex-input"
            type="text"
            :fluid="true"
            :model-value="nodeValue ?? ''"
            :placeholder="cardXNodeXWidgetData.config.placeholder"
            :pt="{ root: { id: cardXNodeXWidgetData.node.alias } }"
            @update:model-value="handleUpdateModelValue"
        />
        <Button
            class="p-button-text custom-text-button"
            @click="shouldShowHelpDrawer = true"
        >
            {{ $gettext("EDTF Formatting") }}
        </Button>

        <EDTFHelpDrawer
            v-model:should-show-help-drawer="shouldShowHelpDrawer"
        />
    </div>
</template>

<style scoped>
.field-with-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
}

.flex-input {
    flex: 1 1 auto;
    min-width: 0;
}

.custom-text-button {
    padding: 0rem 1rem;
}
</style>
