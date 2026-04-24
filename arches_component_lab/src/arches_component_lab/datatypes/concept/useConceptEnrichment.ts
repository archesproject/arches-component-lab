import { computed, ref, watch } from "vue";
import type { Ref } from "vue";

import { fetchConceptsTree } from "@/arches_component_lab/datatypes/concept/api.ts";
import { getOption } from "@/arches_component_lab/datatypes/concept/utils.ts";

import type { CollectionItem } from "@/arches_component_lab/datatypes/concept/types.ts";

export function useConceptEnrichment(
    nodeValue: Ref<string | null>,
    graphSlug: string,
    nodeAlias: string,
) {
    const resolved = ref<CollectionItem | null>(null);
    const loading = ref(false);
    let generation = 0;

    watch(
        nodeValue,
        async (val) => {
            const mine = ++generation;
            resolved.value = null;
            loading.value = !!val;
            if (!val) {
                loading.value = false;
                return;
            }
            const tree = await fetchConceptsTree(graphSlug, nodeAlias);
            if (mine === generation) {
                resolved.value = getOption(val, tree.results);
                loading.value = false;
            }
        },
        { immediate: true },
    );

    const label = computed(() => resolved.value?.label ?? null);
    return { resolved, label, loading };
}
