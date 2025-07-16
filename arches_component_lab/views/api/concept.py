from django.views.generic import View
from arches.app.utils.response import JSONResponse
from arches.app.views.concept import paged_dropdown
from ..node_config_mixin import CardNodeWidgetConfigMixin


class ConceptsForNodeView(View, CardNodeWidgetConfigMixin):
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
