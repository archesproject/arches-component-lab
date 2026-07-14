<script setup lang="ts">
import { computed, ref, toRef, watch } from "vue";

import ResourceInstanceMultiselectWidgetEditor from "@/arches_component_lab/widgets/ResourceInstanceMultiselectWidget/components/ResourceInstanceMultiselectWidgetEditor.vue";
import ResourceInstanceMultiselectWidgetViewer from "@/arches_component_lab/widgets/ResourceInstanceMultiselectWidget/components/ResourceInstanceMultiselectWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";
import { useResourceDisplayNamesResolver } from "@/arches_component_lab/datatypes/resource-instance-list/useResourceDisplayNamesResolver.ts";
import { buildResourceInstanceListAliasedNodeData } from "@/arches_component_lab/datatypes/resource-instance-list/utils.ts";

import type { PropType } from "vue";
import type {
    ResourceInstanceListAliasedNodeData,
    ResourceInstanceReference,
} from "@/arches_component_lab/datatypes/resource-instance-list/types.ts";
import type { ResourceInstanceMultiselectWidgetProps } from "@/arches_component_lab/widgets/ResourceInstanceMultiselectWidget/types.ts";

const { aliasedNodeData, graphSlug, nodeAlias, value } = defineProps({
    mode: {
        type: String as PropType<
            ResourceInstanceMultiselectWidgetProps["mode"]
        >,
        required: true,
    },
    nodeAlias: {
        type: String as PropType<
            ResourceInstanceMultiselectWidgetProps["nodeAlias"]
        >,
        default: undefined,
    },
    graphSlug: {
        type: String as PropType<
            ResourceInstanceMultiselectWidgetProps["graphSlug"]
        >,
        default: undefined,
    },
    cardXNodeXWidgetData: {
        type: Object as PropType<
            ResourceInstanceMultiselectWidgetProps["cardXNodeXWidgetData"]
        >,
        default: undefined,
    },
    aliasedNodeData: {
        type: Object as PropType<
            ResourceInstanceMultiselectWidgetProps["aliasedNodeData"]
        >,
        default: undefined,
    },
    value: {
        type: Array as PropType<
            ResourceInstanceMultiselectWidgetProps["value"]
        >,
        default: undefined,
    },
});

interface ResourceInstanceMultiselectWidgetEmits {
    (event: "update:isLoading", isLoading: boolean): void;
    (
        event: "update:value",
        updatedValue: ResourceInstanceReference[] | null,
    ): void;
    (
        event: "update:aliasedNodeData",
        updatedValue: ResourceInstanceListAliasedNodeData,
    ): void;
    (
        event: "initialized",
        updatedValue: ResourceInstanceListAliasedNodeData,
    ): void;
}

const emit: ResourceInstanceMultiselectWidgetEmits = defineEmits([
    "update:isLoading",
    "update:value",
    "update:aliasedNodeData",
    "initialized",
]);

const isEditorLoading = ref(false);

const { resolved: resolvedItems, loading } = useResourceDisplayNamesResolver(
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

    return buildResourceInstanceListAliasedNodeData(
        value ?? null,
        resolvedItems.value,
    );
});

watch([loading, isEditorLoading], ([resolverLoading, editorLoading]) =>
    emit("update:isLoading", resolverLoading || editorLoading),
);

function onUpdateAliasedNodeData(
    updatedAliasedNodeData: ResourceInstanceListAliasedNodeData,
) {
    emit("update:aliasedNodeData", updatedAliasedNodeData);
    emit("update:value", updatedAliasedNodeData.node_value);
}
</script>

<template>
    <ResourceInstanceMultiselectWidgetEditor
        v-if="mode === EDIT"
        :card-x-node-x-widget-data="cardXNodeXWidgetData"
        :graph-slug="graphSlug"
        :node-alias="nodeAlias"
        :aliased-node-data="resolvedAliasedNodeData"
        @update:is-loading="isEditorLoading = $event"
        @update:aliased-node-data="onUpdateAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
    <ResourceInstanceMultiselectWidgetViewer
        v-if="mode === VIEW"
        :aliased-node-data="resolvedAliasedNodeData"
        @initialized="emit('initialized', $event)"
    />
</template>
