<script setup lang="ts">
import { onMounted } from "vue";
import MultiSelect from "primevue/multiselect";

import { buildDomainListAliasedNodeData } from "@/arches_component_lab/datatypes/domain/utils.ts";

import type { PropType } from "vue";
import type {
    DomainCardXNodeXWidgetData,
    DomainListAliasedNodeData,
} from "@/arches_component_lab/datatypes/domain/types.ts";

interface DomainMultiselectWidgetEditorProps {
    cardXNodeXWidgetData?: DomainCardXNodeXWidgetData;
    aliasedNodeData: DomainListAliasedNodeData | null;
}

const { aliasedNodeData, cardXNodeXWidgetData } = defineProps({
    cardXNodeXWidgetData: {
        type: Object as PropType<
            DomainMultiselectWidgetEditorProps["cardXNodeXWidgetData"]
        >,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<
            DomainMultiselectWidgetEditorProps["aliasedNodeData"]
        >,
        required: true,
    },
});

const options = cardXNodeXWidgetData?.node.config.options ?? [];

interface DomainMultiselectWidgetEditorEmits {
    (
        event: "update:aliasedNodeData",
        updatedValue: DomainListAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: DomainListAliasedNodeData): void;
}

const emit: DomainMultiselectWidgetEditorEmits = defineEmits([
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
    <MultiSelect
        option-value="id"
        option-label="text"
        :input-id="cardXNodeXWidgetData?.node.alias"
        :options="options"
        :placeholder="cardXNodeXWidgetData?.config.placeholder"
        :fluid="true"
        :show-clear="true"
        :model-value="aliasedNodeData?.node_value ?? []"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
