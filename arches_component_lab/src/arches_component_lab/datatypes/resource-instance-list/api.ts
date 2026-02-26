import type { ResourceInstanceListOption } from "@/arches_component_lab/datatypes/resource-instance-list/types.ts";
import { generateArchesURL } from "@/arches/utils/generate-arches-url.ts";

export const fetchRelatableResources = async (
    graphSlug: string,
    nodeAlias: string,
    page: number,
    filterTerm?: string[] | string,
    initialValues?: ResourceInstanceListOption[] | null | undefined,
) => {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    if (filterTerm) {
        if (!Array.isArray(filterTerm)) {
            filterTerm = [filterTerm];
        }
        filterTerm.forEach((term) => {
            params.append("filter_term", term);
        });
    }
    initialValues?.forEach((initialValue) => {
        params.append("initialValue", initialValue.resource_id);
    });
    const response = await fetch(
        `${generateArchesURL("arches_component_lab:api-relatable-resources", { graph: graphSlug, node_alias: nodeAlias })}?${params}`,
    );

    const parsed = await response.json();
    if (!response.ok) throw new Error(parsed.message || response.statusText);
    return parsed;
};

export const fetchGraphs = async (graphId?: string[] | string) => {
    const response = await fetch(
        generateArchesURL("arches:graphs_api", { graph_id: graphId }),
    );

    const parsed = await response.json();
    if (!response.ok) throw new Error(parsed.message || response.statusText);
    return parsed;
};
