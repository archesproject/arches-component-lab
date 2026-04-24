import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";

export interface DomainDatatypeCardXNodeXWidgetData
    extends CardXNodeXWidgetData {
    node: CardXNodeXWidgetData["node"] & {
        config: {
            options: DomainOption[];
        };
    };
}

export interface DomainOption {
    id: string;
    text: string;
    selected: boolean;
}
