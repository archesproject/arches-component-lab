import { ref, watch } from "vue";
import type { Ref } from "vue";

import { useEnrichmentStore } from "@/arches_component_lab/enrichment/enrichmentStore.ts";

export function useEnrichment<T>(type: string, id: Ref<string | null>) {
    const store = useEnrichmentStore();
    const resolved = ref<T | null>(null);
    const loading = ref(false);
    let generation = 0;

    watch(
        id,
        async (val) => {
            const mine = ++generation;
            resolved.value = null;
            loading.value = !!val;
            if (!val) {
                loading.value = false;
                return;
            }
            const result = await store.resolve<T>(type, val);
            if (mine === generation) {
                resolved.value = result;
                loading.value = false;
            }
        },
        { immediate: true },
    );

    return { resolved, loading };
}
