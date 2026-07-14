<script setup lang="ts">
import { onMounted } from "vue";
import Checkbox from "primevue/checkbox";
import CheckboxGroup from "primevue/checkboxgroup";

import { buildDomainListAliasedNodeData } from "@/arches_component_lab/datatypes/domain/utils.ts";

import type { PropType } from "vue";
import type {
    DomainCardXNodeXWidgetData,
    DomainListAliasedNodeData,
} from "@/arches_component_lab/datatypes/domain/types.ts";

interface DomainCheckboxWidgetEditorProps {
    cardXNodeXWidgetData?: DomainCardXNodeXWidgetData;
    aliasedNodeData: DomainListAliasedNodeData | null;
}

const { aliasedNodeData, cardXNodeXWidgetData } = defineProps({
    cardXNodeXWidgetData: {
        type: Object as PropType<
            DomainCheckboxWidgetEditorProps["cardXNodeXWidgetData"]
        >,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<
            DomainCheckboxWidgetEditorProps["aliasedNodeData"]
        >,
        required: true,
    },
});

const options = cardXNodeXWidgetData?.node.config.options ?? [];

interface DomainCheckboxWidgetEditorEmits {
    (
        event: "update:aliasedNodeData",
        updatedValue: DomainListAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: DomainListAliasedNodeData): void;
}

const emit: DomainCheckboxWidgetEditorEmits = defineEmits([
    "update:aliasedNodeData",
    "initialized",
]);

onMounted(() => {
    emit(
        "initialized",
        aliasedNodeData ?? buildDomainListAliasedNodeData(null, options),
    );
});

function onUpdateModelValue(updatedValue: string[] | null) {
    const nodeValues = updatedValue?.length ? updatedValue : null;
    emit(
        "update:aliasedNodeData",
        buildDomainListAliasedNodeData(nodeValues, options),
    );
}
</script>

<template>
    <CheckboxGroup
        :id="cardXNodeXWidgetData?.node.alias"
        :model-value="aliasedNodeData?.node_value ?? []"
        class="button-group"
        tabindex="-1"
        @update:model-value="onUpdateModelValue($event)"
    >
        <div
            v-for="option of options"
            :key="option.id"
            class="button-group"
        >
            <Checkbox
                :input-id="option.id"
                :value="option.id"
            />
            <label :for="option.id">{{ option.text }}</label>
        </div>
    </CheckboxGroup>
</template>
<style scoped>
.button-group {
    display: flex;
    flex-direction: row;
    column-gap: 1.5rem;
    row-gap: 0.5rem;
    flex-wrap: wrap;
}
.checkbox-options {
    display: flex;
    gap: 0.25rem;
    align-items: center;
}
</style>
