<script setup lang="ts">
import { useTemplateRef, watch } from "vue";
import dayjs from "dayjs";

import DatePicker from "primevue/datepicker";
import Message from "primevue/message";

import { FormField } from "@primevue/forms";
import type { FormFieldResolverOptions } from "@primevue/forms";

const props = defineProps<{
    initialValue: Date | undefined;
    graphSlug: string;
    nodeAlias: string;
    configuration: {
        dateFormat: string;
        label: string;
        datePickerDisplayConfiguration: {
            dateFormat: string;
            shouldShowTime: boolean;
        };
    };
}>();

const formFieldRef = useTemplateRef("formFieldRef");

// this watcher is necessary to be able to format the value of the form field when the date picker is updated
watch(
    // @ts-expect-error - This is a bug in the PrimeVue types
    () => formFieldRef.value?.field?.states?.value,
    (newVal, oldVal) => {
        if (newVal !== oldVal) {
            // @ts-expect-error - This is a bug in the PrimeVue types
            formFieldRef.value!.field.states.value = dayjs(newVal).format(
                props.configuration.dateFormat,
            );
        }
    },
);

let timeout: ReturnType<typeof setTimeout>;

function resolver(e: FormFieldResolverOptions) {
    return new Promise((resolve) => {
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            resolve(validate(e));
        }, 500);
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function validate(e: FormFieldResolverOptions) {
    // API call to validate the input
    // if (true) {
    //     return {};
    // } else {
    //     return {
    //         errors: [
    //             { message: "This is an error message" },
    //             { message: "This is also an error message" },
    //         ],
    //     };
    // }
}
</script>

<template>
    <FormField
        ref="formFieldRef"
        v-slot="$field"
        :name="props.nodeAlias"
        :initial-value="props.initialValue"
        :resolver="resolver"
    >
        <DatePicker
            icon-display="input"
            :date-format="
                props.configuration.datePickerDisplayConfiguration.dateFormat
            "
            :fluid="true"
            :show-icon="true"
            :show-time="
                props.configuration.datePickerDisplayConfiguration
                    .shouldShowTime
            "
            :show-seconds="
                props.configuration.datePickerDisplayConfiguration
                    .shouldShowTime
            "
            @keydown.enter.prevent
        />
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
