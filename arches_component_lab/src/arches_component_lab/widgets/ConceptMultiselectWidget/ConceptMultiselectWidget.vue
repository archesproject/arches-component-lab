<script setup lang="ts">
import { computed, ref, toRef, watch } from "vue";

import ConceptMultiSelectWidgetEditor from "@/arches_component_lab/widgets/ConceptMultiselectWidget/components/ConceptMultiselectWidgetEditor.vue";
import ConceptMultiSelectWidgetViewer from "@/arches_component_lab/widgets/ConceptMultiselectWidget/components/ConceptMultiselectWidgetViewer.vue";

import { useConceptLabelsResolver } from "@/arches_component_lab/datatypes/concept-list/useConceptLabelsResolver.ts";
import { buildConceptListAliasedNodeData } from "@/arches_component_lab/datatypes/concept-list/utils.ts";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { PropType } from "vue";
import type { ConceptListAliasedNodeData } from "@/arches_component_lab/datatypes/concept-list/types.ts";
import type { ConceptMultiselectWidgetProps } from "@/arches_component_lab/widgets/ConceptMultiselectWidget/types.ts";

const { aliasedNodeData, graphSlug, nodeAlias, value } = defineProps({
    mode: {
        type: String as PropType<ConceptMultiselectWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<ConceptMultiselectWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<ConceptMultiselectWidgetProps["graphSlug"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<
            ConceptMultiselectWidgetProps["cardXNodeXWidgetData"]
        >,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<
            ConceptMultiselectWidgetProps["aliasedNodeData"]
        >,
        default: undefined,
    },
    value: {
        type: Array as PropType<ConceptMultiselectWidgetProps["value"]>,
        default: undefined,
    },
});

interface ConceptMultiselectWidgetEmits {
    (event: "update:isLoading", isLoading: boolean): void;
    (event: "update:value", updatedValue: string[] | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: ConceptListAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: ConceptListAliasedNodeData): void;
}

const emit: ConceptMultiselectWidgetEmits = defineEmits([
    "update:isLoading",
    "update:value",
    "update:aliasedNodeData",
    "initialized",
]);

const { resolvedItems, loading } = useConceptLabelsResolver(
    toRef(() => {
        if (!aliasedNodeData) {
            return value ?? null;
        }
        return null;
    }),
    graphSlug ?? "",
    nodeAlias ?? "",
);

const isEditorLoading = ref(false);

const resolvedAliasedNodeData = computed(() => {
    if (aliasedNodeData) {
        return aliasedNodeData;
    }
    if (loading.value) {
        return null;
    }

    return buildConceptListAliasedNodeData(value ?? null, resolvedItems.value);
});

watch([loading, isEditorLoading], ([resolverLoading, editorLoading]) =>
    emit("update:isLoading", resolverLoading || editorLoading),
);

function onUpdateAliasedNodeData(
    updatedAliasedNodeData: ConceptListAliasedNodeData,
) {
    emit("update:aliasedNodeData", updatedAliasedNodeData);
    emit("update:value", updatedAliasedNodeData.node_value);
}
</script>

<template>
    <ConceptMultiSelectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
        :aliased-node-data="resolvedAliasedNodeData"
        @update:is-loading="isEditorLoading = $event"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <ConceptMultiSelectWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
