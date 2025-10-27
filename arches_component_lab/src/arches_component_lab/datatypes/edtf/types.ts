import type { AliasedNodeData } from "@/arches_component_lab/types.ts";

export interface EdtfValue extends AliasedNodeData {
    display_value: string;
    node_value: string;
    details: never[];
}
