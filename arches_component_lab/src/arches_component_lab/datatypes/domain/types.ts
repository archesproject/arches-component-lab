import type { AliasedNodeData } from "@/arches_component_lab/types.ts";

export interface DomainValue extends AliasedNodeData {
    display_value: string;
    node_value: string | null;
    details: never[];
}

export interface DomainValueList extends AliasedNodeData {
    display_value: string;
    node_value: string[] | null;
    details: never[];
}

export interface DomainOption {
    id: string;
    text: string;
    selected: boolean;
}
