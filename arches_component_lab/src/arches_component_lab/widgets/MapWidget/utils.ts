import MapboxDraw from "@mapbox/mapbox-gl-draw";

import type { FeatureCollection } from "geojson";
import type { Map as MaplibreMap } from "maplibre-gl";

import type { AliasedNodeData } from "@/arches_component_lab/types.ts";

export function buildMapAliasedNodeData(
    nodeValue: FeatureCollection | null,
): AliasedNodeData {
    const featureCount = nodeValue?.features?.length ?? 0;
    return {
        node_value: nodeValue,
        display_value: featureCount > 0 ? `${featureCount} feature(s)` : "",
        details: nodeValue?.features ?? [],
    };
}

export function getMapboxDraw(
    map: MaplibreMap,
): InstanceType<typeof MapboxDraw> | undefined {
    return map._controls?.find(
        (control: unknown) => control instanceof MapboxDraw,
    ) as InstanceType<typeof MapboxDraw> | undefined;
}
