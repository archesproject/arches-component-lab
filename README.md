> [!WARNING]
> **This package is deprecated and no longer maintained.**
> Please migrate to [arches-vue-components](https://pypi.org/project/arches-vue-components/) instead.

# Arches Component Lab

A Vue 3 / PrimeVue component library for building custom Arches applications.

## Installation

```
pip install arches-component-lab
```


## Project Configuration

1. If you don't already have an Arches project, you'll need to create one by following the instructions in the Arches [documentation](http://archesproject.org/documentation/).

2. Add `arches_querysets` and `arches_component_lab` to `INSTALLED_APPS` below the name of your project but above `arches`. For Arches >= 8.x, also add `pgtrigger`:
```python
INSTALLED_APPS = (
    "my_project_name",
    ...
    "arches_querysets",
    "arches_component_lab",
    "arches",
    ...
    "pgtrigger",
)
```

3. Add `arches_component_lab` as a dependency in `package.json`:
```json
"dependencies": {
    "arches_component_lab": "archesproject/arches-component-lab#main"
}
```

4. Add the `arches_component_lab` URLs to `urls.py`:
```python
urlpatterns = [
    path("", include("arches_component_lab.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

5. Start your project and install frontend dependencies:
```
python manage.py runserver
```
```
npm install && npm run build_development
```

6. Check for missing `WidgetMapping` records:
```
python manage.py validate --codes 2001 --verbosity 2
```
See [Extending Arches Component Lab](#extending-arches-component-lab) if any are missing.


## Frontend API

### Bootstrapping an app

```typescript
import MyComponent from '@/my_project/MyComponent.vue';

import { createVueApplication } from '@/arches_component_lab/application';

createVueApplication({ component: MyComponent }).then(app => app.mount('#app'));
```

### Using a widget

```vue
<script setup lang="ts">
import { ref } from 'vue';

import { TextWidget } from '@/arches_component_lab/widgets';

import type { WidgetMode } from '@/arches_component_lab/widgets';
import type { StringAliasedNodeData } from '@/arches_component_lab/datatypes';

const MODE: WidgetMode = 'edit';
const nodeData = ref<StringAliasedNodeData | null>(null);
</script>

<template>
    <TextWidget
        node-alias="my_text_node"
        :mode="MODE"
        :aliased-node-data="nodeData"
        @update:aliased-node-data="nodeData = $event"
    />
</template>
```

### Using GenericCard

```vue
<GenericCard
    graph-slug="my_graph"
    :tile-id="tileId"
/>
```

### Reference

#### `@/arches_component_lab/widgets`

| Name | Type |
|------|------|
| `WidgetMode` | `'edit' \| 'view' \| 'configure'` |
| `BaseWidgetProps` | `{ mode: WidgetMode; nodeAlias?: string; graphSlug?: string }` |

Widget → `aliasedNodeData` type (import from `@/arches_component_lab/datatypes`):

| Component | `aliasedNodeData` type |
|-----------|----------------------|
| `TextWidget`, `RichTextWidget` | `StringAliasedNodeData` |
| `NonLocalizedTextWidget` | `NonLocalizedTextAliasedNodeData` |
| `NumberWidget` | `NumberAliasedNodeData` |
| `DatePickerWidget` | `DateAliasedNodeData` |
| `EDTFWidget` | `EDTFAliasedNodeData` |
| `ConceptSelectWidget`, `ConceptRadioWidget` | `ConceptAliasedNodeData` |
| `ConceptMultiselectWidget` | `ConceptListAliasedNodeData` |
| `DomainSelectWidget`, `DomainRadioWidget` | `DomainAliasedNodeData` |
| `DomainCheckboxWidget`, `DomainMultiselectWidget` | `DomainListAliasedNodeData` |
| `LanguageSelectWidget` | `LanguageAliasedNodeData` |
| `RadioBooleanWidget`, `SwitchWidget` | `BooleanAliasedNodeData` |
| `ResourceInstanceSelectWidget` | `ResourceInstanceAliasedNodeData` |
| `ResourceInstanceMultiselectWidget` | `ResourceInstanceListAliasedNodeData` |
| `FileListWidget` | `FileListAliasedNodeData` |
| `NodeValueSelectWidget` | `NodeValueAliasedNodeData` |
| `URLWidget` | `URLAliasedNodeData` |
| `MapWidget` | `GeoJSONFeatureCollectionAliasedNodeData` |

Widget config types (for `cardXNodeXWidgetData`):

| Type | Used by |
|------|---------|
| `CardXNodeXWidgetData` | base type for all widgets |
| `StringCardXNodeXWidgetData` | `TextWidget`, `RichTextWidget` |
| `BooleanCardXNodeXWidgetData` | `RadioBooleanWidget`, `SwitchWidget` |
| `ConceptCardXNodeXWidgetData` | `ConceptRadioWidget` |
| `DateCardXNodeXWidgetData` | `DatePickerWidget` |
| `DomainCardXNodeXWidgetData` | domain widgets |
| `FileListCardXNodeXWidgetData` | `FileListWidget` |
| `NumberCardXNodeXWidgetData` | `NumberWidget` |
| `ResourceInstanceCardXNodeXWidgetData` | `ResourceInstanceSelectWidget` |
| `ResourceInstanceListCardXNodeXWidgetData` | `ResourceInstanceMultiselectWidget` |
| `MapCardXNodeXWidgetData` | `MapWidget` |

#### `@/arches_component_lab/generics`

| Export | Description |
|--------|-------------|
| `GenericCard` | Card editor/viewer for a nodegroup |
| `GenericWidget` | Single widget resolved from widget config |
| `GenericCardProps`, `GenericWidgetProps` | Props interfaces |
| `AliasedNodeData`, `AliasedTileData` | Node/tile value types |

#### `@/arches_component_lab/datatypes`

`*AliasedNodeData` types are listed in the widget table above. Supporting types:

| Export | Description |
|--------|-------------|
| `LanguageValue` | Per-language string value (`{ value: string; direction: 'ltr' \| 'rtl' }`) |
| `URLNodeValue` | URL node value (`{ url: string; url_label: string }`) |
| `FileReference` | File attachment reference |
| `ResourceInstanceReference` | Resource instance link reference |
| `DomainOption` | Domain value option |

#### `@/arches_component_lab/application`

| Name | Type |
|------|------|
| `createVueApplication` | `(options: CreateVueApplicationOptions) => Promise<App>` |
| `generateArchesURL` | `(urlName: string, urlParameters?: Record<string, string \| number>, queryParameters?: Record<string, string \| number>, languageCode?: string) => string` |
| `CreateVueApplicationOptions` | `{ component: Component; themeConfiguration?: ArchesThemeConfiguration; initialProps?: Record<string, unknown> }` |

#### `@/arches_component_lab/themes`

| Name | Type |
|------|------|
| `DEFAULT_THEME` | `ArchesThemeConfiguration` |
| `ArchesThemeConfiguration` | PrimeVue theme configuration |


## Extending Arches Component Lab

Arches Component Lab uses the `WidgetMapping` model to map widgets to their Vue components. To check for missing mappings:
```
python manage.py widget check_mappings
```

To add a mapping:
```
python manage.py widget add_mapping -wn language-select -cp arches_component_lab/widgets/LanguageSelectWidget/LanguageSelectWidget.vue
```
