from django.db.models import Q
from django.views.generic import View

from arches import VERSION as arches_version
from arches.app.models import models
from arches.app.utils.response import JSONResponse

# TODO: Replace with DataTypeFactory from arches_querysets
from arches.app.datatypes.datatypes import DataTypeFactory
from ..node_config_mixin import CardNodeWidgetConfigMixin


class CardXNodeXWidgetView(View, CardNodeWidgetConfigMixin):
    def get(self, request, graph_slug, node_alias):
        config = self.get_card_x_node_x_widget(graph_slug, node_alias)
        serialized = self.serialize_card_x_node_x_widget(config, DataTypeFactory())
        return JSONResponse(serialized)


class CardXNodeXWidgetListFromNodegroupView(View, CardNodeWidgetConfigMixin):
    def get(self, request, graph_slug, nodegroup_grouping_node_alias):
        card_x_node_x_widgets_query = Q(
            node__graph__slug=graph_slug,
            node__nodegroup__node__alias=nodegroup_grouping_node_alias,
        )

        if arches_version >= (8, 0):
            card_x_node_x_widgets_query &= Q(node__source_identifier_id__isnull=True)

        card_x_node_x_widgets = (
            models.CardXNodeXWidget.objects.filter(card_x_node_x_widgets_query)
            .select_related()  # Eagerly load _all_ related objects
            .order_by("sortorder")
        )

        datatype_factory = DataTypeFactory()
        data = [
            self.serialize_card_x_node_x_widget(widget, datatype_factory)
            for widget in card_x_node_x_widgets
        ]

        return JSONResponse(data)
