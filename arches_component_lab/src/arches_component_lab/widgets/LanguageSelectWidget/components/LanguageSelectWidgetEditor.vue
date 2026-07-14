<script setup lang="ts">
import { onMounted } from "vue";

import Select from "primevue/select";

import { useLanguageStore } from "@/arches_component_lab/stores/useLanguageStore.ts";
import { buildLanguageAliasedNodeData } from "@/arches_component_lab/datatypes/language/utils.ts";

import type { PropType } from "vue";
import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { LanguageAliasedNodeData } from "@/arches_component_lab/datatypes/language/types.ts";

interface LanguageSelectWidgetEditorProps {
    cardXNodeXWidgetData?: CardXNodeXWidgetData;
    aliasedNodeData: LanguageAliasedNodeData | null;
}

const { aliasedNodeData, cardXNodeXWidgetData } = defineProps({
    cardXNodeXWidgetData: {
        type: Object as PropType<
            LanguageSelectWidgetEditorProps["cardXNodeXWidgetData"]
        >,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<
            LanguageSelectWidgetEditorProps["aliasedNodeData"]
        >,
        required: true,
    },
});

interface LanguageSelectWidgetEditorEmits {
    (
        event: "update:aliasedNodeData",
        updatedValue: LanguageAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: LanguageAliasedNodeData): void;
}

const emit: LanguageSelectWidgetEditorEmits = defineEmits([
    "update:aliasedNodeData",
    "initialized",
]);

const languageStore = useLanguageStore();
languageStore.fetchAllLanguages();

onMounted(() => {
    emit(
        "initialized",
        aliasedNodeData ??
            buildLanguageAliasedNodeData(null, languageStore.languages),
    );
});

function onUpdateModelValue(updatedValue: string | null) {
    emit(
        "update:aliasedNodeData",
        buildLanguageAliasedNodeData(updatedValue, languageStore.languages),
    );
}
</script>

<template>
    <Select
        option-value="code"
        option-label="name"
        :input-id="cardXNodeXWidgetData?.node.alias"
        :options="languageStore.languages"
        :placeholder="cardXNodeXWidgetData?.config.placeholder"
        :fluid="true"
        :model-value="aliasedNodeData?.node_value ?? null"
        @update:model-value="onUpdateModelValue($event)"
    />
</template>
