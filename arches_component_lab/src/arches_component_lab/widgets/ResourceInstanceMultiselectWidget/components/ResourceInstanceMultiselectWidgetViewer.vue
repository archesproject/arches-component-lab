<script setup lang="ts">
import { toRef } from "vue";

import arches from "arches";

import { useResourceInstanceListEnrichment } from "@/arches_component_lab/datatypes/resource-instance-list/useResourceInstanceListEnrichment.ts";
import type { ResourceInstanceReference } from "@/arches_component_lab/datatypes/resource-instance-list/types";

const props = defineProps<{
    nodeValue: ResourceInstanceReference[] | null;
    graphSlug: string;
    nodeAlias: string;
}>();

const { resolved } = useResourceInstanceListEnrichment(
    toRef(props, "nodeValue"),
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
