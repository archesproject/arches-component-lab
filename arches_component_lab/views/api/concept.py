from django.views.generic import View
from arches.app.utils.response import JSONResponse
from arches.app.views.concept import paged_dropdown
from ..node_config_mixin import CardNodeWidgetConfigMixin
from arches.app.models.concept import Concept


class ConceptsFlatView(View, CardNodeWidgetConfigMixin):
    # "http://localhost:82/bcap/concepts/paged_dropdown?conceptid=b0d496d4-2b00-4a65-8715-a9384e9e188e&query=&page=3"
    def get(self, request, graph_slug, node_alias, page=0):
        cnw_config = self.get_card_x_node_x_widget(graph_slug, node_alias)
        print("Config: ", cnw_config.node.config)
        if (
            not cnw_config.node.datatype.startswith("concept")
            or "rdmCollection" not in cnw_config.node.config
        ):
            return JSONResponse(
                {
                    "error": f"Invalid node datatype",
                    "details": f"Node {node_alias} must have a concept or concept-list datatype, not {cnw_config.node.datatype}.",
                },
                status=500,
            )
        conceptid = cnw_config.node.config["rdmCollection"]
        get_params = request.GET.copy()
        get_params["conceptid"] = conceptid
        request.GET = get_params

        return paged_dropdown(request)


class ConceptsTreeView(View, CardNodeWidgetConfigMixin):
    def get(self, request, graph_slug, node_alias):
        cnw_config = self.get_card_x_node_x_widget(graph_slug, node_alias)
        print("Config: ", cnw_config.node.config)

        if (
            not cnw_config.node.datatype.startswith("concept")
            or "rdmCollection" not in cnw_config.node.config
        ):
            return JSONResponse(
                {
                    "error": f"Invalid node datatype",
                    "details": f"Node {node_alias} must have a concept or concept-list datatype, not {cnw_config.node.datatype}.",
                },
                status=500,
            )

        concept_id = cnw_config.node.config["rdmCollection"]
        results = Concept().get_e55_domain(concept_id)

        def set_results_keys(results):
            results = [
                result | {"key": result["id"], "label": result["text"]}
                for result in results
            ]
            for result in results:
                if len(result["children"]) > 0:
                    result["children"] = set_results_keys(result["children"])
            return results

        results = set_results_keys(results)

        def count_results(results):
            return len(results) + sum(
                list(map(lambda result: count_results(result["children"]), results))
            )

        total_count = count_results(results)
        data = results

        return JSONResponse(
            {"results": data, "more": False, "total_results": total_count}
        )
