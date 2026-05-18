import { defineStore } from "pinia";

import arches from "arches";

import type { ConceptFetchResult } from "@/arches_component_lab/datatypes/concept/types.ts";

export const useConceptTreeStore = defineStore("conceptTree", () => {
    const inflightFetches = new Map<
        string,
        Map<string, Promise<ConceptFetchResult>>
    >();

    function getNodeAliasCache(
        graphSlug: string,
    ): Map<string, Promise<ConceptFetchResult>> {
        if (!inflightFetches.has(graphSlug)) {
            inflightFetches.set(graphSlug, new Map());
        }
        return inflightFetches.get(graphSlug)!;
    }

    function fetchTree(
        graphSlug: string,
        nodeAlias: string,
    ): Promise<ConceptFetchResult> {
        const nodeAliasCache = getNodeAliasCache(graphSlug);
        if (!nodeAliasCache.has(nodeAlias)) {
            nodeAliasCache.set(
                nodeAlias,
                (async () => {
                    const response = await fetch(
                        arches.urls.api_concepts_tree(graphSlug, nodeAlias),
                    );
                    const parsed = await response.json();
                    if (!response.ok) {
                        throw new Error(parsed.message || response.statusText);
                    }
                    return parsed;
                })(),
            );
        }
        return nodeAliasCache.get(nodeAlias)!;
    }

    return { fetchTree };
});
