import type { AliasedNodeData } from "@/arches_component_lab/types.ts";

export interface PointGeometry {
    type: "Point";
    coordinates: [number, number];
}

export interface LineGeometry {
    type: "Line";
    coordinates: [[number, number], [number, number]];
}

export interface PolygonGeometry {
    type: "Polygon";
    coordinates: [number, number][];
}

export interface GeoJSONFeature {
    id: string;
    type: "Feature";
    geometry: PointGeometry | LineGeometry | PolygonGeometry;
    properties: Record<string, unknown>;
}

export interface GeoJSONFeatureCollection {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
    properties: Record<string, unknown>;
}

export interface GeoJSONFeatureCollectionValue extends AliasedNodeData {
    display_value: string;
    node_value: GeoJSONFeatureCollection | null;
    details: never[];
}
