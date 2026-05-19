import { defineStore } from "pinia";

import { fetchRelatableResources as fetchSingleRelatableResource } from "@/arches_component_lab/datatypes/resource-instance/api.ts";
import { fetchRelatableResources as fetchListRelatableResources } from "@/arches_component_lab/datatypes/resource-instance-list/api.ts";

import type { ResourceInstanceSelectOption } from "@/arches_component_lab/datatypes/resource-instance/types.ts";
import type { ResourceInstanceListOption } from "@/arches_component_lab/datatypes/resource-instance-list/types.ts";

export const useResourceDisplayNameStore = defineStore(
    "resourceDisplayName",
    () => {
        const inflightSingleFetches = new Map<
            string,
            Map<
                string,
                Map<string, Promise<ResourceInstanceSelectOption | null>>
            >
        >();
        const inflightListFetches = new Map<
            string,
            Map<string, Map<string, Promise<ResourceInstanceListOption[]>>>
        >();

        function getResourceIdCache(
            graphSlug: string,
            nodeAlias: string,
        ): Map<string, Promise<ResourceInstanceSelectOption | null>> {
            if (!inflightSingleFetches.has(graphSlug)) {
                inflightSingleFetches.set(graphSlug, new Map());
            }
            const graphCache = inflightSingleFetches.get(graphSlug)!;
            if (!graphCache.has(nodeAlias)) {
                graphCache.set(nodeAlias, new Map());
            }
            return graphCache.get(nodeAlias)!;
        }

        function getResourceIdsCache(
            graphSlug: string,
            nodeAlias: string,
        ): Map<string, Promise<ResourceInstanceListOption[]>> {
            if (!inflightListFetches.has(graphSlug)) {
                inflightListFetches.set(graphSlug, new Map());
            }
            const graphCache = inflightListFetches.get(graphSlug)!;
            if (!graphCache.has(nodeAlias)) {
                graphCache.set(nodeAlias, new Map());
            }
            return graphCache.get(nodeAlias)!;
        }

        function fetchDisplayName(
            graphSlug: string,
            nodeAlias: string,
            resourceId: string,
        ): Promise<ResourceInstanceSelectOption | null> {
            const resourceIdCache = getResourceIdCache(graphSlug, nodeAlias);
            if (!resourceIdCache.has(resourceId)) {
                resourceIdCache.set(
                    resourceId,
                    fetchSingleRelatableResource(
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
                        ).find(
                            (resourceRecord) =>
                                resourceRecord.resourceinstanceid ===
                                resourceId,
                        );
                        return item
                            ? {
                                  resource_id: resourceId,
                                  display_value: item.display_value,
                              }
                            : null;
                    }),
                );
            }
            return resourceIdCache.get(resourceId)!;
        }

        function fetchDisplayNames(
            graphSlug: string,
            nodeAlias: string,
            ids: string[],
        ): Promise<ResourceInstanceListOption[]> {
            const resourceIdsCache = getResourceIdsCache(graphSlug, nodeAlias);
            const idsKey = [...ids].sort().join(",");
            if (!resourceIdsCache.has(idsKey)) {
                resourceIdsCache.set(
                    idsKey,
                    fetchListRelatableResources(
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
                        ).map((resourceRecord) => ({
                            resource_id: resourceRecord.resourceinstanceid,
                            display_value: resourceRecord.display_value,
                        })),
                    ),
                );
            }
            return resourceIdsCache.get(idsKey)!;
        }

        return { fetchDisplayName, fetchDisplayNames };
    },
);
