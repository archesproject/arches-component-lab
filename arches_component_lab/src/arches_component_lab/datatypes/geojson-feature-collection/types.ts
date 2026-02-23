import type { AliasedNodeData } from "@/arches_component_lab/types.ts";

export interface GeoJSONFeatureCollectionValue extends AliasedNodeData {
    display_value: string;
    node_value: GeoJSON.FeatureCollection | null;
    details: never[];
}
