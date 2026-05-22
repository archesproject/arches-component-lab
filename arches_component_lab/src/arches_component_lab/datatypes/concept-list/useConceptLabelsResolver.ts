import { computed, ref, watch } from "vue";

import { useConceptTreeStore } from "@/arches_component_lab/stores/useConceptTreeStore.ts";
import { getOption } from "@/arches_component_lab/datatypes/concept/utils.ts";

import type { Ref } from "vue";

export function useConceptLabelsResolver(
    nodeValue: Ref<string[] | null>,
    graphSlug: string,
    nodeAlias: string,
) {
    const resolved = ref<string[]>([]);
    const loading = ref(false);
    let latestRequestId = 0;

    watch(
        nodeValue,
        async (newConceptIds) => {
            const requestId = ++latestRequestId;
            resolved.value = [];
            loading.value = !!newConceptIds?.length;
            if (!newConceptIds?.length) {
                loading.value = false;
                return;
            }
            const conceptTree = await useConceptTreeStore().fetchTree(
                graphSlug,
                nodeAlias,
            );
            if (requestId === latestRequestId) {
                resolved.value = newConceptIds
                    .map(
                        (conceptId) =>
                            getOption(conceptId, conceptTree.results)?.label ??
                            conceptId,
                    )
                    .filter(Boolean);
                loading.value = false;
            }
        },
        { immediate: true },
    );

    const labels = computed(() => resolved.value);
    return { labels, loading };
}
