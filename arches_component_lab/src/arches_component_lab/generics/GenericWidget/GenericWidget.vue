<script setup lang="ts">
import {
    computed,
    defineAsyncComponent,
    ref,
    shallowRef,
    useAttrs,
    watch,
    watchEffect,
} from "vue";

import Message from "primevue/message";
import Skeleton from "primevue/skeleton";

import GenericWidgetLabel from "@/arches_component_lab/generics/GenericWidget/components/GenericWidgetLabel.vue";
import GenericFormField from "@/arches_component_lab/generics/GenericWidget/components/GenericFormField.vue";

import { EDIT, VIEW } from "@/arches_component_lab/widgets/constants.ts";
import { useWidgetConfigStore } from "@/arches_component_lab/stores/useWidgetConfigStore.ts";
import { removeVueExtension } from "@/arches_component_lab/generics/GenericWidget/utils.ts";

import type { CSSProperties } from "vue";
import type { CardXNodeXWidgetData } from "@/arches_component_lab/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

const {
    cardXNodeXWidgetData,
    cardXNodeXWidgetDataOverrides,
    graphSlug,
    isDirty = false,
    mode,
    nodeAlias,
    shouldShowLabel = true,
    value,
} = defineProps<{
    cardXNodeXWidgetData?: CardXNodeXWidgetData;
    cardXNodeXWidgetDataOverrides?: Partial<CardXNodeXWidgetData>;
    graphSlug: string;
    isDirty?: boolean;
    mode: WidgetMode;
    nodeAlias: string;
    shouldShowLabel?: boolean;
    value?: unknown | null | undefined;
}>();

const emit = defineEmits([
    "update:isDirty",
    "update:isFocused",
    "update:isLoading",
    "update:value",
]);

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const isLoading = ref(false);
const isChildLoading = ref(false);
const resolvedCardXNodeXWidgetData = shallowRef(cardXNodeXWidgetData);
const configurationError = ref<Error>();

const attrsClass = computed(() => attrs.class as string | undefined);
const attrsStyle = computed(
    () => attrs.style as string | CSSProperties | undefined,
);
const attrsForComponent = computed(() => {
    const { class: _class, style: _style, ...rest } = attrs;
    return rest;
});

const isCombinedLoading = computed(
    () => isLoading.value || isChildLoading.value,
);

const widgetComponent = computed(() => {
    if (!resolvedCardXNodeXWidgetData.value) {
        return null;
    }

    return defineAsyncComponent(async () => {
        try {
            return await import(
                `@/${removeVueExtension(resolvedCardXNodeXWidgetData.value!.widget.component)}.vue`
            );
        } catch (err) {
            configurationError.value = err as Error;
        }
    });
});

const widgetNodeValue = computed<unknown>(() => {
    if (value !== undefined) {
        return value ?? null;
    }
    const dv = resolvedCardXNodeXWidgetData.value?.config?.defaultValue;
    if (
        dv !== null &&
        dv !== undefined &&
        typeof dv === "object" &&
        "node_value" in dv
    ) {
        return (dv as { node_value: unknown }).node_value ?? null;
    }
    return dv ?? null;
});

watch(isCombinedLoading, (newValue) => {
    emit("update:isLoading", newValue);
});

watchEffect(async () => {
    if (resolvedCardXNodeXWidgetData.value) {
        return;
    }

    isLoading.value = true;

    try {
        resolvedCardXNodeXWidgetData.value =
            await useWidgetConfigStore().fetchWidgetConfig(
                graphSlug,
                nodeAlias,
            );
        if (
            cardXNodeXWidgetDataOverrides &&
            resolvedCardXNodeXWidgetData.value
        ) {
            resolvedCardXNodeXWidgetData.value = {
                ...resolvedCardXNodeXWidgetData.value,
                ...cardXNodeXWidgetDataOverrides,
            };
        }
    } catch (error) {
        configurationError.value = error as Error;
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <div
        class="widget"
        :class="attrsClass"
        :style="attrsStyle"
        :data-graph-slug="graphSlug"
        :data-node-alias="nodeAlias"
        @focusin="() => emit('update:isFocused', true)"
        @focusout="() => emit('update:isFocused', false)"
    >
        <Skeleton
            v-if="isLoading"
            style="height: 2rem"
        />
        <Message
            v-else-if="configurationError"
            severity="error"
            size="small"
        >
            {{ configurationError.message }}
        </Message>
        <template v-else-if="widgetComponent && resolvedCardXNodeXWidgetData">
            <GenericWidgetLabel
                v-if="shouldShowLabel"
                :mode="mode"
                :card-x-node-x-widget-data="resolvedCardXNodeXWidgetData"
            />

            <GenericFormField
                v-if="mode === EDIT"
                v-slot="{ onUpdateValue }"
                :value="widgetNodeValue"
                :is-dirty="isDirty"
                :node-alias="nodeAlias"
                @update:is-dirty="emit('update:isDirty', $event)"
                @update:value="emit('update:value', $event)"
            >
                <component
                    :is="widgetComponent"
                    v-bind="attrsForComponent"
                    :key="resolvedCardXNodeXWidgetData.id"
                    :card-x-node-x-widget-data="resolvedCardXNodeXWidgetData"
                    :graph-slug="graphSlug"
                    :mode="mode"
                    :node-alias="nodeAlias"
                    :value="widgetNodeValue"
                    @update:is-loading="isChildLoading = $event"
                    @update:value="onUpdateValue($event)"
                />
            </GenericFormField>

            <component
                :is="widgetComponent"
                v-else-if="mode === VIEW"
                v-bind="attrsForComponent"
                :key="resolvedCardXNodeXWidgetData.id"
                :card-x-node-x-widget-data="resolvedCardXNodeXWidgetData"
                :graph-slug="graphSlug"
                :mode="mode"
                :node-alias="nodeAlias"
                :value="widgetNodeValue"
                @update:is-loading="isChildLoading = $event"
            />
        </template>
    </div>
</template>

<style scoped>
.widget {
    display: flex;
    flex-direction: column;
}
</style>
