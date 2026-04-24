import { defineStore } from "pinia";
import { nextTick, reactive } from "vue";

type Resolver<T = unknown> = (ids: string[]) => Promise<Map<string, T>>;

export const useEnrichmentStore = defineStore("enrichment", () => {
    const cache = reactive<Record<string, Record<string, unknown>>>({});
    const queues = reactive<Record<string, Set<string>>>({});
    const resolvers: Record<string, Resolver> = {};
    const flushes: Record<string, Promise<void> | null> = {};

    function register<T>(type: string, resolver: Resolver<T>) {
        if (type in resolvers) return;
        resolvers[type] = resolver as Resolver;
        queues[type] = new Set();
        flushes[type] = null;
        cache[type] = {};
    }

    function resolve<T>(type: string, id: string): Promise<T | null> {
        if (!(type in resolvers)) {
            console.warn(`[EnrichmentStore] No resolver registered for type: ${type}`);
            return Promise.resolve(null);
        }
        if (id in cache[type]) return Promise.resolve(cache[type][id] as T);
        queues[type].add(id);
        if (!flushes[type]) {
            flushes[type] = nextTick().then(async () => {
                const ids = [...queues[type]];
                queues[type].clear();
                flushes[type] = null;
                const results = await resolvers[type](ids);
                for (const [k, v] of results.entries()) cache[type][k] = v;
            });
        }
        return flushes[type]!.then(() => (cache[type]?.[id] as T) ?? null);
    }

    return { cache, register, resolve };
});
