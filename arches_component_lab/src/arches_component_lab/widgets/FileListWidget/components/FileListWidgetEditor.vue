<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";

import Message from "primevue/message";
import FileUpload from "primevue/fileupload";

import { FormField } from "@primevue/forms";
import type { FormFieldResolverOptions } from "@primevue/forms";
import type { FileReference } from "@/arches_component_lab/widgets/types.ts";

const props = defineProps<{
    initialValue: FileReference[] | null | undefined;
    graphSlug: string;
    nodeAlias: string;
    widgetData: {
        config: {
            acceptedFiles: string;
            maxFilesize: number;
            rerender: boolean;
            label: string;
        };
    };
    nodeData: {
        config: {
            imagesOnly: boolean;
            maxFiles: number;
            maxFileSize: number;
        };
    };
}>();

const formFieldRef = useTemplateRef("formFieldRef");

onMounted(() => {
    console.log("PROPS", props);
    console.log("FORMFIELDREF", formFieldRef);
});

// let timeout: ReturnType<typeof setTimeout>;

function resolver(e: FormFieldResolverOptions) {
    validate(e);
    // return new Promise((resolve) => {
    //     if (timeout) clearTimeout(timeout);

    //     timeout = setTimeout(() => {
    //         resolve(validate(e));
    //     }, 500);
    // });
}

function onUpload(e: object) {
    console.log("onUpload", e);
}

function validate(e: FormFieldResolverOptions) {
    console.log("validate", e);
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
        <FileUpload
            mode="basic"
            accept="image/*"
            @upload="onUpload"
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
