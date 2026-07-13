import importlib.metadata
import warnings

__version__ = importlib.metadata.version(__package__)

warnings.warn(
    "arches-component-lab is deprecated and will no longer be maintained. "
    "Please migrate to arches-vue-components instead.",
    UserWarning,
    stacklevel=2,
)
