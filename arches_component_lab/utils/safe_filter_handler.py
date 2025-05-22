import logging
from django.core.exceptions import FieldError

logger = logging.getLogger(__name__)


def apply_filters(model, filter_args):
    object_filter = model.objects
    for arg in filter_args:
        try:
            object_filter = object_filter.filter(**{arg: filter_args[arg]})
        except FieldError:
            logger.warning(f"Removing key - {arg} does not exist in model")
            print()

    return object_filter
