<script setup lang="ts">
import { computed, ref, toRef, watch } from "vue";

import ConceptSelectWidgetEditor from "@/arches_component_lab/widgets/ConceptSelectWidget/components/ConceptSelectWidgetEditor.vue";
import ConceptSelectWidgetViewer from "@/arches_component_lab/widgets/ConceptSelectWidget/components/ConceptSelectWidgetViewer.vue";

import { useConceptLabelResolver } from "@/arches_component_lab/datatypes/concept/useConceptLabelResolver.ts";
import { buildConceptAliasedNodeData } from "@/arches_component_lab/datatypes/concept/utils.ts";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";

import type { PropType } from "vue";
import type { ConceptAliasedNodeData } from "@/arches_component_lab/datatypes/concept/types.ts";
import type { ConceptSelectWidgetProps } from "@/arches_component_lab/widgets/ConceptSelectWidget/types.ts";

const { aliasedNodeData, graphSlug, nodeAlias, value } = defineProps({
    mode: {
        type: String as PropType<ConceptSelectWidgetProps["mode"]>,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<ConceptSelectWidgetProps["nodeAlias"]>,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<ConceptSelectWidgetProps["graphSlug"]>,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<
            ConceptSelectWidgetProps["cardXNodeXWidgetData"]
        >,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<ConceptSelectWidgetProps["aliasedNodeData"]>,
        default: undefined,
    },
    value: {
        type: String as PropType<ConceptSelectWidgetProps["value"]>,
        default: undefined,
    },
});

interface ConceptSelectWidgetEmits {
    (event: "update:isLoading", isLoading: boolean): void;
    (event: "update:value", updatedValue: string | null): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: ConceptAliasedNodeData,
    ): void;
    (event: "initialized", updatedValue: ConceptAliasedNodeData): void;
}

const emit: ConceptSelectWidgetEmits = defineEmits([
    "update:isLoading",
    "update:value",
    "update:aliasedNodeData",
    "initialized",
]);

const isEditorLoading = ref(false);

const { resolved, loading } = useConceptLabelResolver(
    toRef(() => {
        if (!aliasedNodeData) {
            return value ?? null;
        }
        return null;
    }),
    graphSlug ?? "",
    nodeAlias ?? "",
);

const resolvedAliasedNodeData = computed(() => {
    if (aliasedNodeData) {
        return aliasedNodeData;
    }
    if (loading.value) {
        return null;
    }

    return buildConceptAliasedNodeData(
        value ?? null,
        resolved.value ? [resolved.value] : [],
    );
});

watch([loading, isEditorLoading], ([resolverLoading, editorLoading]) =>
    emit("update:isLoading", resolverLoading || editorLoading),
);

function onUpdateAliasedNodeData(
    updatedAliasedNodeData: ConceptAliasedNodeData,
) {
    emit("update:aliasedNodeData", updatedAliasedNodeData);
    emit("update:value", updatedAliasedNodeData.node_value);
}
</script>

<template>
    <ConceptSelectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
        :aliased-node-data="resolvedAliasedNodeData"
        @update:is-loading="isEditorLoading = $event"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <ConceptSelectWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
