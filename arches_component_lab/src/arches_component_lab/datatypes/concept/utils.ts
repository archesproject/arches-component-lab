import type { ConceptOption, CollectionItem } from "./types";
import type { AliasedNodeData } from "@/arches_component_lab/types.ts";

function getOption(
    value: string,
    options: ConceptOption[] | CollectionItem[],
): ConceptOption | CollectionItem | null | undefined {
    if (!Object.hasOwn(options[0], "key")) {
        return options.find((option) => (option as ConceptOption).id == value);
    } // It's a collectionItem
    else {
        function findNode(
            tree: CollectionItem[],
            predicate: (object: CollectionItem) => boolean,
        ): CollectionItem | null {
            for (const node of tree) {
                if (predicate(node)) return node;
                if (node.children) {
                    const result = findNode(node.children, predicate);
                    if (result) return result;
                }
            }
            return null;
        }
        return findNode(
            options as CollectionItem[],
            (option: CollectionItem) => option.key == value,
        );
    }
}

export function convertConceptOptionToFormValue(
    conceptOptionId: string,
    options: ConceptOption[] | CollectionItem[],
): AliasedNodeData {
    const option = getOption(conceptOptionId, options);

    return Object.hasOwn(options[0], "id")
        ? {
              display_value: option ? (option as ConceptOption).text : "",
              node_value: conceptOptionId ? [conceptOptionId] : [],
              details: option ? [option] : [],
          }
        : {
              display_value: option ? (option as CollectionItem).label : "",
              node_value: conceptOptionId ? [conceptOptionId] : [],
              details: option ? [option] : [],
          };
}
