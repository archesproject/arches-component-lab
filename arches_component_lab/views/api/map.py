import json

from django.utils.translation import get_language, get_language_bidi
from django.views.generic import View

from arches.app.datatypes.datatypes import DataTypeFactory
from arches.app.models import models
from arches.app.models.system_settings import settings
from arches.app.utils.permission_backend import user_can_read_map_layers
from arches.app.utils.response import JSONResponse

from arches_component_lab.utils.geo_utils import GeoUtils


def _patch_tile_url(source_dict):
    if "tiles" in source_dict:
        tiles = source_dict["tiles"]
        if tiles and not tiles[0].startswith("http"):
            source_dict["tiles"] = [
                "{}{}".format(settings.PUBLIC_SERVER_ADDRESS, tiles[0])
            ]
    return source_dict


class MapSettingsAPI(View):
    def get(self, request):
        return JSONResponse(
            {
                "ACTIVE_LANGUAGE": get_language(),
                "ACTIVE_LANGUAGE_DIRECTION": "rtl" if get_language_bidi() else "ltr",
                "DEFAULT_BOUNDS": getattr(settings, "DEFAULT_BOUNDS", None),
            }
        )


class MapDataAPI(View):
    def get(self, request):
        map_layers = user_can_read_map_layers(request.user)
        map_sources = list(models.MapSource.objects.all())
        for map_source in map_sources:
            _patch_tile_url(map_source.source)

        datatype_factory = DataTypeFactory()
        geom_nodes = (
            models.Node.objects.filter(
                graph__isresource=True,
                graph__is_active=True,
                graph__source_identifier__isnull=True,
                datatype__in=models.DDataType.objects.filter(isgeometric=True),
            )
            .exclude(graph__graphid=settings.SYSTEM_SETTINGS_RESOURCE_MODEL_ID)
            .select_related("nodegroup", "graph")
        )
        resource_map_layers = []
        resource_map_sources = []
        for node in geom_nodes:
            if request.user.has_perm("read_nodegroup", node.nodegroup):
                datatype = datatype_factory.get_instance(node.datatype)
                resource_source = datatype.get_map_source(node)
                if resource_source is not None:
                    parsed_source = json.loads(resource_source["source"])
                    _patch_tile_url(parsed_source)
                    resource_map_sources.append(
                        {
                            "name": resource_source["name"],
                            "source": parsed_source,
                        }
                    )
                    resource_layer = datatype.get_map_layer(node)
                    if resource_layer is not None:
                        resource_map_layers.append(
                            {
                                "maplayerid": str(resource_layer["nodeid"]),
                                "name": resource_layer["name"],
                                "layerdefinitions": json.loads(
                                    resource_layer["layer_definitions"]
                                ),
                                "isoverlay": True,
                                "is_resource_layer": True,
                                "icon": resource_layer.get("icon", ""),
                                "addtomap": resource_layer.get("addtomap", False),
                                "sortorder": 0,
                            }
                        )

        return JSONResponse(
            {
                "map_layers": map_layers,
                "map_sources": map_sources,
                "basemaps": getattr(settings, "BASEMAPS", []),
                "resource_map_layers": resource_map_layers,
                "resource_map_sources": resource_map_sources,
            }
        )


class FeatureBufferAPI(View):
    def post(self, request):
        data = json.loads(request.body)
        geo_utils = GeoUtils()
        return JSONResponse(geo_utils.buffer_feature_collection(data["features"]))


class GeoJSONBoundsAPI(View):
    def post(self, request):
        geo_utils = GeoUtils()
        return JSONResponse(geo_utils.get_bounds_from_geojson(json.loads(request.body)))
