import { computed, ref, watch } from "vue";
import type { Ref } from "vue";

import { fetchRelatableResources } from "@/arches_component_lab/datatypes/resource-instance/api.ts";

import type {
    ResourceInstanceReference,
    ResourceInstanceSelectOption,
} from "@/arches_component_lab/datatypes/resource-instance/types.ts";

// Cached per "graphSlug:nodeAlias:resourceId". Individual requests for now;
// TODO: replace resolver with a bulk display-name endpoint (Phase 5 prerequisite).
const displayNameCache = new Map<
    string,
    Promise<ResourceInstanceSelectOption | null>
>();

export function useResourceInstanceEnrichment(
    nodeValue: Ref<ResourceInstanceReference | null>,
    graphSlug: string,
    nodeAlias: string,
) {
    const resolved = ref<ResourceInstanceSelectOption | null>(null);
    const loading = ref(false);
    let generation = 0;

    watch(
        nodeValue,
        async (val) => {
            const mine = ++generation;
            resolved.value = null;
            const resourceId = val?.resourceId ?? null;
            loading.value = !!resourceId;
            if (!resourceId) {
                loading.value = false;
                return;
            }

            const cacheKey = `${graphSlug}:${nodeAlias}:${resourceId}`;
            if (!displayNameCache.has(cacheKey)) {
                displayNameCache.set(
                    cacheKey,
                    fetchRelatableResources(
                        graphSlug,
                        nodeAlias,
                        1,
                        undefined,
                        resourceId,
                    ).then((data) => {
                        const item = (
                            data.data as {
                                resourceinstanceid: string;
                                display_value: string;
                            }[]
                        ).find((r) => r.resourceinstanceid === resourceId);
                        return item
                            ? {
                                  resource_id: resourceId,
                                  display_value: item.display_value,
                              }
                            : null;
                    }),
                );
            }

            const result = await displayNameCache.get(cacheKey)!;
            if (mine === generation) {
                resolved.value = result;
                loading.value = false;
            }
        },
        { immediate: true },
    );

    const displayValue = computed(() => resolved.value?.display_value ?? null);
    const resourceId = computed(() => resolved.value?.resource_id ?? null);

    return { resolved, displayValue, resourceId, loading };
}
