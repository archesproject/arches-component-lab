<script setup lang="ts">
import { computed, ref, watch } from "vue";

import LanguageSelectWidgetEditor from "@/arches_component_lab/widgets/LanguageSelectWidget/components/LanguageSelectWidgetEditor.vue";
import LanguageSelectWidgetViewer from "@/arches_component_lab/widgets/LanguageSelectWidget/components/LanguageSelectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";
import { useLanguageStore } from "@/arches_component_lab/stores/useLanguageStore.ts";
import { buildLanguageAliasedNodeData } from "@/arches_component_lab/datatypes/language/utils.ts";

import type { PropType } from "vue";
import type { LanguageAliasedNodeData } from "@/arches_component_lab/datatypes/language/types.ts";
import type { LanguageSelectWidgetProps } from "@/arches_component_lab/widgets/LanguageSelectWidget/types.ts";

const { aliasedNodeData, value } = defineProps({
    mode: {
        type: String as PropType<LanguageSelectWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<LanguageSelectWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<LanguageSelectWidgetProps["graphSlug"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<
            LanguageSelectWidgetProps["cardXNodeXWidgetData"]
        >,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<LanguageSelectWidgetProps["aliasedNodeData"]>,
        default: undefined,
    },
    value: {
        type: String as PropType<LanguageSelectWidgetProps["value"]>,
        default: undefined,
    },
});

interface LanguageSelectWidgetEmits {
    (event: "update:isLoading", isLoading: boolean): void;
    (event: "update:value", updatedValue: string | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: LanguageAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: LanguageAliasedNodeData): void;
}

const emit: LanguageSelectWidgetEmits = defineEmits([
    "update:isLoading",
    "update:value",
    "update:aliasedNodeData",
    "initialized",
]);

const languageStore = useLanguageStore();
const isLanguagesLoading = ref(true);

languageStore
    .fetchAllLanguages()
    .then(() => {
        isLanguagesLoading.value = false;
    })
    .catch(() => {
        isLanguagesLoading.value = false;
    });

const resolvedAliasedNodeData = computed(() => {
    if (aliasedNodeData) {
        return aliasedNodeData;
    }
    if (isLanguagesLoading.value) {
        return null;
    }
    return buildLanguageAliasedNodeData(value ?? null, languageStore.languages);
});

watch(isLanguagesLoading, (isLoading) => emit("update:isLoading", isLoading));

function onUpdateAliasedNodeData(
    updatedAliasedNodeData: LanguageAliasedNodeData,
) {
    emit("update:aliasedNodeData", updatedAliasedNodeData);
    emit("update:value", updatedAliasedNodeData.node_value);
}
</script>

<template>
    <LanguageSelectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :aliased-node-data="resolvedAliasedNodeData"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <LanguageSelectWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
