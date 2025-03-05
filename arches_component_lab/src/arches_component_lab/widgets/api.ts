import arches from "arches";

export const fetchWidget = async (
    graphSlug: string,
    nodeAlias: string,
) => {
    const response = await fetch(
        arches.urls.api_widget_configuration(graphSlug, nodeAlias),
    );

    try {
        const parsed = await response.json();
        if (response.ok) {
            return parsed;
        }
        throw new Error(parsed.message);
    } catch (error) {
        throw new Error((error as Error).message || response.statusText);
    }
};

export const fetchNode = async (
    graphSlug: string,
    nodeAlias: string,
) => {
    const response = await fetch(
        arches.urls.api_node_configuration(graphSlug, nodeAlias),
    );

    try {
        const parsed = await response.json();
        if (response.ok) {
            return parsed;
        }
        throw new Error(parsed.message);
    } catch (error) {
        throw new Error((error as Error).message || response.statusText);
    }
};

export const fetchLists = async (
    nodeAliases: string[] | undefined = undefined,
) => {
    const params = new URLSearchParams();
    nodeAliases?.forEach((alias) => params.append("node_alias", alias));
    const response = await fetch(`${arches.urls.controlled_lists}?${params}`);
    try {
        const parsed = await response.json();
        if (response.ok) {
            return parsed;
        }
        throw new Error(parsed.message);
    } catch (error) {
        throw new Error((error as Error).message || response.statusText);
    }
};

export const fetchRelatableResources = async (
    graphSlug: string,
    nodeAlias: string,
    page: number,
    filterTerm?: string,
) => {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    if (filterTerm) {
        params.append("filter_term", filterTerm);
    }

    const response = await fetch(
        `${arches.urls.api_relatable_resources(
            graphSlug,
            nodeAlias,
        )}?${params}`,
    );

    const parsed = await response.json();
    if (!response.ok) throw new Error(parsed.message || response.statusText);
    return parsed;
};
