<script setup lang="ts">
import { inject, ref, watch } from "vue";

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useGettext } from "vue3-gettext";

import type { Feature, Map } from "maplibre-gl";
import type { Ref } from "vue";

import InputNumber from "primevue/inputnumber";
import Panel from "primevue/panel";
import Select from "primevue/select";

import {
    DRAW_UPDATE_EVENT,
    FEET,
    KILOMETERS,
    METERS,
    MILES,
    YARDS,
} from "@/arches_component_lab/widgets/MapWidget/constants.ts";

const props = defineProps<{
    map: Map;
}>();

const selectedDrawnFeature = inject<Ref<Feature | null>>(
    "selectedDrawnFeature",
    ref(null),
);

const { $gettext } = useGettext();

const bufferDistance: Ref<number> = ref(0);

const options = ref([
    { label: $gettext("meters"), code: METERS },
    { label: $gettext("feet"), code: FEET },
    { label: $gettext("miles"), code: MILES },
    { label: $gettext("kilometers"), code: KILOMETERS },
    { label: $gettext("yards"), code: YARDS },
]);

const selectedUnits: Ref<string> = ref(options.value[0].code);

watch([bufferDistance, selectedUnits], () => {
    if (bufferDistance.value < 0) {
        bufferDistance.value = 0;
    }

    if (selectedDrawnFeature.value) {
        const draw = props.map._controls.find(
            (control: unknown) => control instanceof MapboxDraw,
        ) as typeof MapboxDraw;

        (selectedDrawnFeature.value as Feature).properties!.buffer_distance =
            bufferDistance.value;
        (selectedDrawnFeature.value as Feature).properties!.buffer_units =
            selectedUnits.value;

        draw.add(selectedDrawnFeature.value);
        props.map.fire(DRAW_UPDATE_EVENT, {
            features: [selectedDrawnFeature.value],
        });
    }
});

watch(
    selectedDrawnFeature,
    (feature: Feature | null) => {
        if (feature) {
            if (
                Number.isInteger(feature.properties?.buffer_distance) &&
                feature.properties?.buffer_units
            ) {
                bufferDistance.value = feature.properties.buffer_distance;
                selectedUnits.value = feature.properties.buffer_units;
                return;
            }
        }

        bufferDistance.value = 0;
        selectedUnits.value = METERS;
    },
    { immediate: true },
);
</script>

<template>
    <Panel
        class="buffer-controls-panel"
        :pt="{ title: { style: { 'font-weight': 500 } } }"
        :header="$gettext('Buffer Selected Feature')"
    >
        <div class="buffer-controls">
            <label for="buff-distance">{{ $gettext("Distance") }}</label>
            <InputNumber
                id="buff-distance"
                v-model="bufferDistance"
                :min="0"
                :input-style="{ fontSize: '1.4rem' }"
                fluid
            />
            <Select
                id="buff-units"
                v-model="selectedUnits"
                :options="options"
                option-value="code"
                option-label="label"
                :placeholder="$gettext('Units')"
                fluid
            />
        </div>
    </Panel>
</template>

<style scoped>
.buffer-controls-panel {
    margin-block-start: 0.75rem;
}

.buffer-controls {
    align-items: baseline;
    display: flex;
    flex-direction: row;
    gap: 1rem;
}
</style>
