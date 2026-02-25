import arches from "arches";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";

// Promise-based cache: graph config is static for the lifetime of the SPA.
// Keyed by "graphSlug:nodeAlias". Caching the Promise (not the result)
// also deduplicates concurrent in-flight requests.
const cardXNodeXWidgetCache = new Map<string, Promise<CardXNodeXWidgetData>>();

export function fetchCardXNodeXWidgetData(
    graphSlug: string,
    nodeAlias: string,
): Promise<CardXNodeXWidgetData> {
    const cacheKey = `${graphSlug}:${nodeAlias}`;
    const cached = cardXNodeXWidgetCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    const promise = (async () => {
        const response = await fetch(
            arches.urls.api_card_x_node_x_widget(graphSlug, nodeAlias),
        );

        try {
            const parsed = await response.json();
            if (response.ok) {
                return parsed;
            }
            throw new Error(parsed.message);
        } catch (error) {
            throw new Error((error as Error).message || response.statusText);
        }
    })();

    // On failure, evict so a retry can re-fetch.
    promise.catch(() => {
        cardXNodeXWidgetCache.delete(cacheKey);
    });

    cardXNodeXWidgetCache.set(cacheKey, promise);
    return promise;
}
