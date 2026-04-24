<script setup lang="ts">
import { toRef } from "vue";

import arches from "arches";

import { useResourceInstanceEnrichment } from "@/arches_component_lab/datatypes/resource-instance/useResourceInstanceEnrichment.ts";
import type { ResourceInstanceReference } from "@/arches_component_lab/datatypes/resource-instance/types";

const props = defineProps<{
    nodeValue: ResourceInstanceReference | null;
    graphSlug: string;
    nodeAlias: string;
}>();

const { displayValue, resourceId } = useResourceInstanceEnrichment(
    toRef(props, "nodeValue"),
    props.graphSlug,
    props.nodeAlias,
);
</script>

<template>
    <div :key="resourceId ?? undefined">
        <a
            :href="`${arches.urls.resource_editor}${resourceId}`"
            class="resource-instance-link"
        >
            {{ displayValue }}
        </a>
    </div>
</template>
