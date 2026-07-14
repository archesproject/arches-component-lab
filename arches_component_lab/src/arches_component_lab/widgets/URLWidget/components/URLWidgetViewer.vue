<script setup lang="ts">
import { onMounted } from "vue";

import { useGettext } from "vue3-gettext";

import type { PropType } from "vue";
import type { URLAliasedNodeData } from "@/arches_component_lab/datatypes/url/types.ts";

interface URLWidgetViewerProps {
    aliasedNodeData: URLAliasedNodeData;
}

const { aliasedNodeData } = defineProps({
    aliasedNodeData: {
        type: Object as PropType<URLWidgetViewerProps["aliasedNodeData"]>,
        required: true,
    },
});

interface URLWidgetViewerEmits {
    (event: "initialized", updatedValue: URLAliasedNodeData): void;
}

const emit: URLWidgetViewerEmits = defineEmits(["initialized"]);

const { $gettext } = useGettext();

onMounted(() => {
    emit("initialized", aliasedNodeData);
});
</script>

<template>
    <a
        v-if="aliasedNodeData?.node_value?.url"
        :href="aliasedNodeData.node_value.url"
    >
        {{
            aliasedNodeData.node_value.url_label ||
            aliasedNodeData.node_value.url
        }}
    </a>

    <span v-else>
        {{ $gettext("No URL provided") }}
    </span>
</template>
