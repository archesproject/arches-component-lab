import { defineStore } from "pinia";

import arches from "arches";

import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";

export const useWidgetConfigStore = defineStore("widgetConfig", () => {
    const inflightWidgetFetches = new Map<
        string,
        Map<string, Promise<CardXNodeXWidgetData>>
    >();
    const inflightNodegroupFetches = new Map<
        string,
        Map<string, Promise<CardXNodeXWidgetData[]>>
    >();

    function getNodeAliasCache(
        graphSlug: string,
    ): Map<string, Promise<CardXNodeXWidgetData>> {
        if (!inflightWidgetFetches.has(graphSlug)) {
            inflightWidgetFetches.set(graphSlug, new Map());
        }
        return inflightWidgetFetches.get(graphSlug)!;
    }

    function getNodegroupAliasCache(
        graphSlug: string,
    ): Map<string, Promise<CardXNodeXWidgetData[]>> {
        if (!inflightNodegroupFetches.has(graphSlug)) {
            inflightNodegroupFetches.set(graphSlug, new Map());
        }
        return inflightNodegroupFetches.get(graphSlug)!;
    }

    function fetchWidgetConfig(
        graphSlug: string,
        nodeAlias: string,
    ): Promise<CardXNodeXWidgetData> {
        const nodeAliasCache = getNodeAliasCache(graphSlug);
        if (!nodeAliasCache.has(nodeAlias)) {
            const fetchRequest = (async () => {
                const response = await fetch(
                    arches.urls.api_card_x_node_x_widget(graphSlug, nodeAlias),
                );
                const parsed = await response.json();
                if (!response.ok) {
                    throw new Error(parsed.message ?? response.statusText);
                }
                return parsed;
            })();
            fetchRequest.catch(() => nodeAliasCache.delete(nodeAlias));
            nodeAliasCache.set(nodeAlias, fetchRequest);
        }
        return nodeAliasCache.get(nodeAlias)!;
    }

    function fetchNodegroupWidgetConfigs(
        graphSlug: string,
        nodegroupAlias: string,
    ): Promise<CardXNodeXWidgetData[]> {
        const nodegroupAliasCache = getNodegroupAliasCache(graphSlug);
        if (!nodegroupAliasCache.has(nodegroupAlias)) {
            const fetchRequest = (async () => {
                const response = await fetch(
                    arches.urls.api_card_x_node_x_widget_list_from_nodegroup(
                        graphSlug,
                        nodegroupAlias,
                    ),
                );
                const parsed = await response.json();
                if (!response.ok) {
                    throw new Error(parsed.message ?? response.statusText);
                }
                return parsed;
            })();
            fetchRequest.catch(() =>
                nodegroupAliasCache.delete(nodegroupAlias),
            );
            nodegroupAliasCache.set(nodegroupAlias, fetchRequest);
        }
        return nodegroupAliasCache.get(nodegroupAlias)!;
    }

    return { fetchWidgetConfig, fetchNodegroupWidgetConfigs };
});
