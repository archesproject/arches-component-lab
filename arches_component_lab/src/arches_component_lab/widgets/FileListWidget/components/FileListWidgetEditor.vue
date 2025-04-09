<script setup lang="ts">
import { onMounted, useTemplateRef, ref, watch } from "vue";

import Message from "primevue/message";
import FileUpload, {
    type FileUploadBeforeSendEvent,
    type FileUploadBeforeUploadEvent,
    type FileUploadSelectEvent,
    type FileUploadUploadEvent,
} from "primevue/fileupload";

import { FormField } from "@primevue/forms";
import type { FormFieldResolverOptions } from "@primevue/forms";
import type { FileReference } from "@/arches_component_lab/widgets/types.ts";
import type { Ref } from "vue";
const item = ref<FileReference>();
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

// this watcher is necessary to be able to format the value of the form field when the date picker is updated
watch(
    // @ts-expect-error - This is a bug in the PrimeVue types
    () => formFieldRef.value?.field?.states?.value,
    (newVal, oldVal) => {
        console.log("VALS", newVal, oldVal);
        if (newVal !== oldVal) {
            // @ts-expect-error - This is a bug in the PrimeVue types
            // formFieldRef.value!.field.states.value = dayjs(newVal).format(
            //     props.widgetData.config.dateFormat,
            // );
        }
    },
);

onMounted(() => {
    console.log("PROPS", props);
    console.log("FORMFIELDREF", formFieldRef);
});

// let timeout: ReturnType<typeof setTimeout>;
const addHeader = (event: FileUploadBeforeSendEvent) => {
    // const token = Cookies.get("csrftoken");
    // if (token) {
    //     event.xhr.setRequestHeader("X-CSRFToken", token);
    //     event.formData.set("list_item_id", item.value.id);
    // }
};

const upload = (event: FileUploadUploadEvent) => {
    if (event.xhr.status !== 201) {
        return;
    }
    const newImage = JSON.parse(event.xhr.responseText);
    // item.value.images.push(newImage);
};

function resolver(e: FormFieldResolverOptions) {
    const ffr = formFieldRef;
    console.log("RESOLVER", e);
    validate(e);

    return { [props.nodeAlias]: "foo" };
    // return new Promise((resolve) => {
    //     if (timeout) clearTimeout(timeout);

    //     timeout = setTimeout(() => {
    //         resolve(validate(e));
    //     }, 500);
    // });
}

function select(event: FileUploadSelectEvent) {
    for (const file of event.files) {
        const reader = new FileReader();

        reader.onload = async (e) => {
            formFieldRef.value!.field.states.value = e.target?.result;
        };

        reader.readAsDataURL(file);
    }
}
function onUpload(e: object) {
    console.log("onUpload", e);
}

function beforeUpload(e: FileUploadBeforeUploadEvent) {
    console.log("before", e);
}

function validate(e: FormFieldResolverOptions) {
    console.log("validate", e);
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
            accept="image/*"
            :file-limit="10"
            :preview-width="250"
            :with-credentials="true"
            :show-cancel-button="false"
            :show-upload-button="false"
            @select="select"
            choose-icon="fa fa-plus-circle"
            :choose-label="$gettext('Upload an image')"
            :name="props.nodeAlias"
            @upload="upload"
            @before-send="addHeader"
            @before-upload="beforeUpload"
        >
        </FileUpload>
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
