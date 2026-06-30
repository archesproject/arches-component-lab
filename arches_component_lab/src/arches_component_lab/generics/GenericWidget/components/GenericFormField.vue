<script setup lang="ts">
import { ref, useTemplateRef, watchEffect } from "vue";

import { FormField, type FormFieldResolverOptions } from "@primevue/forms";
import Message from "primevue/message";

import type { AliasedNodeData } from "@/arches_component_lab/types.ts";

type FormFieldType = {
    field: {
        states: {
            dirty: boolean;
            pristine: boolean;
            touched: boolean;
        };
        errors: Array<{ message: string }>;
        props: {
            onChange: (event: { value: AliasedNodeData }) => void;
        };
    };
};

const { isDirty, nodeAlias } = defineProps<{
    isDirty: boolean;
    nodeAlias: string;
}>();

const emit = defineEmits<{
    (e: "update:aliasedNodeData", newValue: AliasedNodeData): void;
    (e: "update:isDirty", dirty: boolean): void;
    (e: "initialized"): void;
}>();

const formFieldRef = useTemplateRef<FormFieldType>("formField");
const isInitialized = ref(false);
const resolvedInitialValue = ref<AliasedNodeData | null>(null);

watchEffect(() => {
    if (isDirty) {
        markFormFieldAsDirty();
    }
});

function onWidgetInitialized(aliasedNodeData: AliasedNodeData) {
    if (isInitialized.value) return;
    resolvedInitialValue.value = aliasedNodeData;
    isInitialized.value = true;
    emit("initialized");
}

function markFormFieldAsDirty() {
    if (!formFieldRef.value) {
        return;
    }

    formFieldRef.value.field.states.dirty = true;
    formFieldRef.value.field.states.pristine = false;
    formFieldRef.value.field.states.touched = true;
}

function resolver(updatedNodeValue: FormFieldResolverOptions) {
    const errors = validate(updatedNodeValue);
    return { errors };
}

function validate(_value: FormFieldResolverOptions): string[] {
    return [];
}

function onUpdateAliasedNodeData(aliasedNodeData: AliasedNodeData) {
    formFieldRef.value?.field?.props?.onChange({
        value: aliasedNodeData,
    });

    emit("update:aliasedNodeData", aliasedNodeData);
    emit("update:isDirty", true);
}
</script>

<template>
    <slot
        :on-widget-initialized="onWidgetInitialized"
        :on-update-aliased-node-data="onUpdateAliasedNodeData"
    />

    <FormField
        v-if="isInitialized"
        ref="formField"
        v-slot="$field"
        :name="nodeAlias"
        :resolver="resolver"
        :initial-value="resolvedInitialValue"
    >
        <Message
            v-for="error in $field.errors"
            :key="error.message"
            severity="error"
            size="small"
        >
            {{ error.message }}
        </Message>
    </FormField>
</template>
