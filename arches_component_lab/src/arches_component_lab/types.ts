export interface AliasedTileNodeValue {
    display_value: string;
    node_value: unknown;
    details: unknown[];
}

export interface CardXNodeXWidgetData {
    card: {
        name: string;
    };
    config: {
        defaultValue: unknown | null;
    };
    id: string;
    label: string;
    node: {
        alias: string;
        isrequired: boolean;
        nodeid: string;
    };
    sortorder: number;
    visible: boolean;
    widget: {
        component: string;
    };
}

export interface Language {
    code: string;
    default_direction: "ltr" | "rtl";
    id: number;
    isdefault: boolean;
    name: string;
    scope: string;
}
