<script setup lang="ts">
import { useTemplateRef, watchEffect } from "vue";

import { FormField, type FormFieldResolverOptions } from "@primevue/forms";
import Message from "primevue/message";

type FormFieldType = {
    field: {
        states: {
            dirty: boolean;
            pristine: boolean;
            touched: boolean;
        };
        errors: Array<{ message: string }>;
        props: {
            onChange: (event: { value: unknown }) => void;
        };
    };
};

const { isDirty, nodeAlias, nodeValue } = defineProps<{
    isDirty: boolean;
    nodeAlias: string;
    nodeValue: unknown;
}>();

const emit = defineEmits<{
    (e: "update:value", newValue: unknown): void;
    (e: "update:isDirty", dirty: boolean): void;
}>();

const formFieldRef = useTemplateRef<FormFieldType>("formField");

// cannot inline, this allows the dirty state to be set on first input
const initialValue = Object.freeze(
    Array.isArray(nodeValue)
        ? [...nodeValue]
        : nodeValue && typeof nodeValue === "object"
          ? { ...nodeValue }
          : nodeValue,
);

watchEffect(() => {
    if (isDirty) {
        markFormFieldAsDirty();
    }
});

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

function onUpdateValue(updatedNodeValue: unknown) {
    if (nodeValue === updatedNodeValue) {
        return;
    }

    formFieldRef.value?.field?.props?.onChange({
        value: updatedNodeValue,
    });

    emit("update:value", updatedNodeValue);
    emit("update:isDirty", true);
}
</script>

<template>
    <slot :on-update-value="onUpdateValue" />

    <FormField
        ref="formField"
        v-slot="$field"
        :name="nodeAlias"
        :resolver="resolver"
        :initial-value="initialValue"
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
