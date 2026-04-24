import arches from "arches";

import type { ConceptFetchResult } from "@/arches_component_lab/datatypes/concept/types.ts";

const conceptTreeCache = new Map<string, Promise<ConceptFetchResult>>();

export const fetchConceptsTree = (
    graphSlug: string,
    nodeAlias: string,
): Promise<ConceptFetchResult> => {
    const key = `${graphSlug}:${nodeAlias}`;
    if (!conceptTreeCache.has(key)) {
        conceptTreeCache.set(
            key,
            (async () => {
                const response = await fetch(
                    arches.urls.api_concepts_tree(graphSlug, nodeAlias),
                );
                const parsed = await response.json();
                if (!response.ok)
                    throw new Error(parsed.message || response.statusText);
                return parsed;
            })(),
        );
    }
    return conceptTreeCache.get(key)!;
};
