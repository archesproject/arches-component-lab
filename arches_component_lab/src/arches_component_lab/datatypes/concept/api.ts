import arches from "arches";

import type {
    ConceptFetchResult,
    ConceptOption,
} from "@/arches_component_lab/datatypes/concept/types.ts";

export const fetchConceptsForNode = async (
    graphSlug: string,
    nodeAlias: string,
    page: number,
    filterTerm?: string,
    initialValues?: ConceptOption[] | null | undefined,
): Promise<ConceptFetchResult> => {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    if (filterTerm) {
        params.append("filter_term", filterTerm);
    }
    initialValues?.forEach((initialValue) =>
        params.append("initialValue", initialValue.id),
    );
    const response = await fetch(
        `${arches.urls.api_concepts_for_node(graphSlug, nodeAlias)}?${params}`,
    );
    try {
        const parsed = await response.json();
        if (response.ok) {
            return {total_results: parsed.length} = parsed;
        }
        throw new Error(parsed.message);
    } catch (error) {
        throw new Error((error as Error).message || response.statusText);
    }
};

/*
 * @todo - Currently not paging results
 * @param graphSlug
 * @param nodeAlias
 * @param page
 * @param filterTerm
 * @param initialValues
 */
export const fetchConceptsTree = async (
    graphSlug: string,
    nodeAlias: string,
    page: number,
    filterTerm?: string,
): Promise<ConceptFetchResult> => {
    const params = new URLSearchParams();

    // params.append("page", page.toString());
    if (filterTerm) {
        params.append("filter_term", filterTerm);
    }
    const response = await fetch(
        `${arches.urls.api_concepts(graphSlug, nodeAlias)}?${params}`,
    );

    const parsed = await response.json();
    if (!response.ok) throw new Error(parsed.message || response.statusText);
    return parsed;
};
