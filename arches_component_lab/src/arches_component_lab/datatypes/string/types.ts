import type { AliasedTileNodeValue } from "@/arches_component_lab/types.ts";

export interface LanguageValue {
    value: string;
    direction: "ltr" | "rtl";
}

export interface StringValue extends AliasedTileNodeValue {
    display_value: string;
    node_value: Record<string, LanguageValue>;
    details: never[];
}
