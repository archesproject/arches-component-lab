<script setup lang="ts">
import { onMounted, ref } from "vue";

import Message from "primevue/message";
import Skeleton from "primevue/skeleton";

import NonLocalizedTextAreaWidgetEditor from "@/arches_component_lab/widgets/NonLocalizedTextAreaWidget/components/NonLocalizedTextAreaWidgetEditor.vue";
import NonLocalizedTextAreaWidgetViewer from "@/arches_component_lab/widgets/NonLocalizedTextAreaWidget/components/NonLocalizedTextAreaWidgetViewer.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";
import {
    fetchWidgetData,
    fetchNodeData,
} from "@/arches_component_lab/widgets/api.ts";

import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

const props = withDefaults(
    defineProps<{
        mode: WidgetMode;
        value: string | null | undefined;
        nodeAlias: string;
        graphSlug: string;
        showLabel?: boolean;
    }>(),
    {
        showLabel: true,
    },
);

const isLoading = ref(true);
const nodeData = ref();
const widgetData = ref();
const configurationError = ref();

onMounted(async () => {
    try {
        widgetData.value = await fetchWidgetData(
            props.graphSlug,
            props.nodeAlias,
        );
        nodeData.value = await fetchNodeData(props.graphSlug, props.nodeAlias);
    } catch (error) {
        configurationError.value = error;
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <Skeleton
        v-if="isLoading"
        style="height: 2em"
    />
    <template v-else>
        <label v-if="props.showLabel">
            <span>{{ widgetData.label }}</span>
            <span v-if="nodeData.isrequired && props.mode === EDIT">*</span>
        </label>

        <div :class="[nodeAlias, graphSlug].join(' ')">
            <NonLocalizedTextAreaWidgetEditor
                v-if="mode === EDIT"
                :value="value"
                :graph-slug="props.graphSlug"
                :node-alias="props.nodeAlias"
            />
            <NonLocalizedTextAreaWidgetViewer
                v-else-if="mode === VIEW"
                :value="props.value"
            />
        </div>
    </template>
    <Message
        v-if="configurationError"
        severity="error"
        size="small"
    >
        {{ configurationError.message }}
    </Message>
</template>
