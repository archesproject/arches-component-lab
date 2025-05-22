import logging
from django.core.exceptions import FieldError

logger = logging.getLogger(__name__)


class SafeObjectFilter(object):

    def __init__(self, model):
        super().__init__()
        self.model = model

    def apply_filters(self, **kwargs):
        object_filter = self.model.objects
        for arg in kwargs.items():
            try:
                object_filter = object_filter.filter(arg)
            except FieldError:
                logger.warning(f"Removing key - {arg[0]} does not exist in model")
                print()

        return object_filter
