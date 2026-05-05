<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref, watch } from "vue";
import type { ComputedRef, Ref } from "vue";

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useGettext } from "vue3-gettext";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import type { Map } from "maplibre-gl";

import Select from "primevue/select";

import {
    POINT,
    LINE,
    POLYGON,
    DRAW_POINT,
    DRAW_LINE_STRING,
    DRAW_POLYGON,
    DRAW_CREATE_EVENT,
} from "@/arches_component_lab/widgets/MapWidget/constants.ts";

const props = defineProps<{
    map: Map;
}>();

defineExpose({
    deleteSelectedDrawnFeature,
    deleteAllDrawnFeatures,
});

const { $gettext } = useGettext();

const geometryTypes = inject<
    Ref<string[] | null> | ComputedRef<string[] | null>
>("geometryTypes", ref(null));

const selectedDrawType = ref<string | undefined>();

const allOptions = [
    { label: $gettext("Draw a Marker"), code: POINT },
    { label: $gettext("Draw a Polyline"), code: LINE },
    { label: $gettext("Draw a Polygon"), code: POLYGON },
];

const options = computed(() => {
    const types = geometryTypes.value;
    if (!types?.length) return allOptions;
    return allOptions.filter((opt) => types.includes(opt.code));
});

function getDraw(): InstanceType<typeof MapboxDraw> | undefined {
    return props.map._controls?.find(
        (control: unknown) => control instanceof MapboxDraw,
    ) as InstanceType<typeof MapboxDraw> | undefined;
}

watch(
    () => selectedDrawType.value,
    (newDrawType) => {
        const draw = getDraw();
        if (newDrawType && draw) {
            props.map.getCanvas().style.cursor = "crosshair";
            if (newDrawType === POINT) {
                draw.changeMode(DRAW_POINT);
            } else if (newDrawType === LINE) {
                draw.changeMode(DRAW_LINE_STRING);
            } else if (newDrawType === POLYGON) {
                draw.changeMode(DRAW_POLYGON);
            }
        } else {
            props.map.getCanvas().style.cursor = "";
        }
    },
);

onMounted(() => {
    props.map.on(DRAW_CREATE_EVENT, resetDropdown);
});

onUnmounted(() => {
    props.map.off(DRAW_CREATE_EVENT, resetDropdown);
});

function resetDropdown() {
    selectedDrawType.value = undefined;
}

function deleteAllDrawnFeatures() {
    const draw = getDraw();
    if (!draw) return;
    draw.deleteAll();
    props.map.fire("draw.delete");
}

function deleteSelectedDrawnFeature() {
    const draw = getDraw();
    if (!draw) return;
    const selectedFeatures = draw.getSelected();
    if (selectedFeatures.features.length) {
        const featureId = selectedFeatures.features[0].id;
        draw.delete(featureId);
        props.map.fire("draw.delete");
    }
}
</script>

<template>
    <div class="draw-controls">
        <label for="draw-type">{{ $gettext("Draw type") }}</label>
        <Select
            id="draw-type"
            v-model="selectedDrawType"
            :options="options"
            option-label="label"
            option-value="code"
            :placeholder="$gettext('Draw a shape')"
            class="w-full md:w-56"
            fluid
        />
    </div>
</template>

<style scoped>
.draw-controls {
    align-items: baseline;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-block-start: 0.9375rem;
}
</style>
