import type { AliasedNodeData } from "@/arches_component_lab/types.ts";
import type { CardXNodeXWidgetData } From "@/arches_component_lab/types.ts";

export interface NumberCardXNodeXWidgetData extends CardXNodeXWidgetData {
    config: CardXNodeXWidgetData["config"] & {
        prefix?: string;   
        suffix?: string;
        min?: number;
        max?: number;
        step?: number;
        precision?: string | number;
    };
}

export interface NumberValue extends AliasedNodeData {
    display_value: number;
    node_value: number;
    details: [];
}
