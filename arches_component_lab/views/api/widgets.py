import json

from django.views.generic import View

from arches.app.models import models
from arches.app.utils.response import JSONResponse


class WidgetConfigurationView(View):
    def get(self, request, graph_slug, node_alias):
        node = models.Node.objects.get(
            graph__slug=graph_slug, alias=node_alias, source_identifier_id__isnull=True
        )
        card_x_node_x_widget = models.CardXNodeXWidget.objects.get(
            node__graph__slug=graph_slug,
            node__alias=node_alias,
            node__source_identifier_id__isnull=True,
        )

        node_config = json.loads(node.config.value)
        card_x_node_x_widget_config = json.loads(card_x_node_x_widget.config.value)

        if node.datatype == "date":
            # overwrites the card_x_node_x_widget_config with the node_config
            response = {
                **card_x_node_x_widget_config,
                **node_config,
            }
        else:
            # overwrites the node_config with the card_x_node_x_widget_config
            response = {
                **node_config,
                **card_x_node_x_widget_config,
            }

        return JSONResponse(response)
