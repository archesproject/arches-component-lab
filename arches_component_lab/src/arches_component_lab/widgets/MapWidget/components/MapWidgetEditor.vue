<script setup lang="ts">
import type { GeoJSONFeatureCollectionValue } from "@/arches_component_lab/datatypes/geojson-feature-collection/types";

defineProps<{
    aliasedNodeData: GeoJSONFeatureCollectionValue | null;
}>();
</script>

<template>
    <input
        disabled
        :value="aliasedNodeData?.display_value"
    />
</template>
