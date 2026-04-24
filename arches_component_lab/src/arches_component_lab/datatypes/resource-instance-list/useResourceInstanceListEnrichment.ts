import { ref, watch } from "vue";
import type { Ref } from "vue";

import { fetchRelatableResources } from "@/arches_component_lab/datatypes/resource-instance-list/api.ts";
import type {
    ResourceInstanceReference,
    ResourceInstanceListOption,
} from "@/arches_component_lab/datatypes/resource-instance-list/types.ts";

const listDisplayNameCache = new Map<
    string,
    Promise<ResourceInstanceListOption[]>
>();

export function useResourceInstanceListEnrichment(
    nodeValue: Ref<ResourceInstanceReference[] | null>,
    graphSlug: string,
    nodeAlias: string,
) {
    const resolved = ref<ResourceInstanceListOption[]>([]);
    const loading = ref(false);
    let generation = 0;

    watch(
        nodeValue,
        async (val) => {
            const mine = ++generation;
            resolved.value = [];
            const ids = val?.map((r) => r.resourceId).filter(Boolean) ?? [];
            loading.value = ids.length > 0;
            if (!ids.length) {
                loading.value = false;
                return;
            }
            const cacheKey = `${graphSlug}:${nodeAlias}:${[...ids].sort().join(",")}`;
            if (!listDisplayNameCache.has(cacheKey)) {
                listDisplayNameCache.set(
                    cacheKey,
                    fetchRelatableResources(
                        graphSlug,
                        nodeAlias,
                        1,
                        undefined,
                        ids,
                    ).then((data) =>
                        (
                            data.data as {
                                resourceinstanceid: string;
                                display_value: string;
                            }[]
                        ).map((r) => ({
                            resource_id: r.resourceinstanceid,
                            display_value: r.display_value,
                        })),
                    ),
                );
            }
            const result = await listDisplayNameCache.get(cacheKey)!;
            if (mine === generation) {
                resolved.value = result;
                loading.value = false;
            }
        },
        { immediate: true },
    );

    return { resolved, loading };
}
