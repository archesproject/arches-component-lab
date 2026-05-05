<script setup lang="ts">
import { ref } from "vue";

import { useGettext } from "vue3-gettext";

import Button from "primevue/button";

import BufferControls from "@/arches_component_lab/widgets/MapWidget/components/MapWidgetEditor/components/MapFilter/components/BufferControls.vue";
import DrawControls from "@/arches_component_lab/widgets/MapWidget/components/MapWidgetEditor/components/MapFilter/components/DrawControls.vue";

import type { Map } from "maplibre-gl";
import type { PropType } from "vue";

defineProps({
    map: {
        type: Object as PropType<Map>,
        required: true,
    },
});

const { $gettext } = useGettext();

const drawControlsRef = ref<InstanceType<typeof DrawControls> | null>(null);

function deleteSelectedFeature() {
    drawControlsRef.value?.deleteSelectedDrawnFeature();
}

function clearAllDrawnFeatures() {
    drawControlsRef.value?.deleteAllDrawnFeatures();
}
</script>

<template>
    <DrawControls
        ref="drawControlsRef"
        :map="map"
    />
    <BufferControls :map="map" />
    <div class="clear-btns">
        <Button
            size="large"
            severity="secondary"
            @click="deleteSelectedFeature"
        >
            {{ $gettext("Clear Selected") }}
        </Button>
        <Button
            size="large"
            severity="secondary"
            @click="clearAllDrawnFeatures"
        >
            {{ $gettext("Clear All") }}
        </Button>
    </div>
</template>

<style scoped>
.clear-btns {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding-block-start: 0.9375rem;
}
</style>
