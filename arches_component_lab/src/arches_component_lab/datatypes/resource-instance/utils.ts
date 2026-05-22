import type {
    ResourceInstanceAliasedNodeData,
    ResourceInstanceReference,
} from "@/arches_component_lab/datatypes/resource-instance/types.ts";

export function buildResourceInstanceAliasedNodeData(
    nodeValue: ResourceInstanceReference | null,
    displayName: string,
): ResourceInstanceAliasedNodeData {
    return {
        node_value: nodeValue,
        display_value: displayName,
        details: nodeValue
            ? [
                  {
                      resource_id: nodeValue.resourceId,
                      display_value: displayName,
                  },
              ]
            : [],
    };
}
