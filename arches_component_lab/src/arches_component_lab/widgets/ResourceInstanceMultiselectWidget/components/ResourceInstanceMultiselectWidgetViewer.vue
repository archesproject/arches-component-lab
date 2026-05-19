<script setup lang="ts">
import { toRef } from "vue";

import arches from "arches";

import { useResourceDisplayNamesResolver } from "@/arches_component_lab/datatypes/resource-instance-list/useResourceDisplayNamesResolver.ts";
import type { ResourceInstanceReference } from "@/arches_component_lab/datatypes/resource-instance-list/types";

const props = defineProps<{
    value: ResourceInstanceReference[] | null;
    graphSlug: string;
    nodeAlias: string;
}>();

const { resolved } = useResourceDisplayNamesResolver(
    toRef(props, "value"),
    props.graphSlug,
    props.nodeAlias,
);
</script>

<template>
    <div
        v-for="item in resolved"
        :key="item.resource_id"
    >
        <a
            :href="`${arches.urls.resource_editor}${item.resource_id}`"
            class="resource-instance-link"
        >
            {{ item.display_value }}
        </a>
    </div>
</template>
