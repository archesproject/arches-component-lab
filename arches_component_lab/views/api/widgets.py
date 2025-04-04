import json

from arches.app.utils.betterJSONSerializer import JSONDeserializer, JSONSerializer
from django.utils import translation
from django.views.generic import View

from arches.app.models import models
from arches.app.utils.response import JSONResponse


def update_i18n_properties(response):
    user_language = translation.get_language()
    config = response["config"]

    if "i18n_properties" in config and isinstance(config["i18n_properties"], list):
        for prop in config["i18n_properties"]:
            if (
                prop in config
                and isinstance(config[prop], dict)
                and user_language in config[prop]
            ):
                config[prop] = config[prop][user_language]
    response["config"] = config
    return response


class WidgetDataView(View):
    def get(self, request, graph_slug, node_alias):
        card_x_node_x_widget = models.CardXNodeXWidget.objects.filter(
            node__graph__slug=graph_slug,
            node__alias=node_alias,
            node__source_identifier_id__isnull=True,
        ).first()

        response = update_i18n_properties(
            JSONDeserializer().deserialize(
                JSONSerializer().serialize(card_x_node_x_widget)
            )
        )

        return JSONResponse(response)


class NodeDataView(View):
    def get(self, request, graph_slug, node_alias):
        node = models.Node.objects.get(
            graph__slug=graph_slug, alias=node_alias, source_identifier_id__isnull=True
        )

        response = update_i18n_properties(
            JSONDeserializer().deserialize(JSONSerializer().serialize(node))
        )

        return JSONResponse(response)
