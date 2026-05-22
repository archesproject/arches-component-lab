import type {
    URLAliasedNodeData,
    URLNodeValue,
} from "@/arches_component_lab/datatypes/url/types.ts";

export function buildURLAliasedNodeData(
    nodeValue: URLNodeValue | null,
): URLAliasedNodeData {
    const display = nodeValue?.url_label
        ? `${nodeValue.url_label}(${nodeValue.url})`
        : nodeValue?.url ?? "";
    return {
        node_value: nodeValue,
        display_value: display,
        details: [],
    };
}
