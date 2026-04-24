import { computed, ref, watch } from "vue";
import type { Ref } from "vue";

import { fetchConceptsTree } from "@/arches_component_lab/datatypes/concept/api.ts";
import { getOption } from "@/arches_component_lab/datatypes/concept/utils.ts";

export function useConceptListEnrichment(
    nodeValue: Ref<string[] | null>,
    graphSlug: string,
    nodeAlias: string,
) {
    const resolved = ref<string[]>([]);
    const loading = ref(false);
    let generation = 0;

    watch(
        nodeValue,
        async (val) => {
            const mine = ++generation;
            resolved.value = [];
            loading.value = !!val?.length;
            if (!val?.length) {
                loading.value = false;
                return;
            }
            const tree = await fetchConceptsTree(graphSlug, nodeAlias);
            if (mine === generation) {
                resolved.value = val
                    .map((id) => getOption(id, tree.results)?.label ?? id)
                    .filter(Boolean);
                loading.value = false;
            }
        },
        { immediate: true },
    );

    const labels = computed(() => resolved.value);
    return { labels, loading };
}
