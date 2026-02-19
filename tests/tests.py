from uuid import uuid4
from django.test import TestCase

from arches.app.models.models import Widget
from arches_component_lab.models import WidgetMapping
from arches_component_lab.utils.widget_synchronizer import WidgetSynchronizer


class WidgetSynchronizerTestCase(TestCase):
    def setUp(self):
        self.dummy_widget_0 = Widget.objects.create(
            widgetid=uuid4(),
            name="dummy-widget",
            component="views/components/widgets/dummy",
            helptext=None,
            datatype="string",
            defaultconfig={"defaultValue": None},
        )

        self.dummy_widget_1 = Widget.objects.create(
            widgetid=uuid4(),
            name="another-widget",
            component="views/components/widgets/another",
            helptext=None,
            datatype="string",
            defaultconfig={"defaultValue": None},
        )

    def tearDown(self):
        WidgetMapping.objects.filter(
            widget__in=[self.dummy_widget_0, self.dummy_widget_1]
        ).delete()
        self.dummy_widget_0.delete()
        self.dummy_widget_1.delete()
        super().tearDown()

    def test_synchronize_dummy_widget(self):
        self.assertIsNone(
            WidgetMapping.objects.filter(widget=self.dummy_widget_0).first()
        )
        WidgetSynchronizer().synchronize_widgets(widget_name="dummy-widget")
        mapping = WidgetMapping.objects.filter(widget=self.dummy_widget_0).first()
        self.assertEqual(mapping.widget, self.dummy_widget_0)

    def test_synchronize_with_multiple_missing_widgets_and_no_parameters(self):
        self.assertIsNone(
            WidgetMapping.objects.filter(widget=self.dummy_widget_0).first()
        )
        self.assertIsNone(
            WidgetMapping.objects.filter(widget=self.dummy_widget_1).first()
        )
        with self.assertRaises(ValueError):
            WidgetSynchronizer().synchronize_widgets()
