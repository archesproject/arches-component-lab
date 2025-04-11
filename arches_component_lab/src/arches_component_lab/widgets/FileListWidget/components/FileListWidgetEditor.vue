<script setup lang="ts">
import { onMounted, useTemplateRef, ref, watch } from "vue";
import { useGettext } from "vue3-gettext";
import Message from "primevue/message";
import FileUpload, {
    type FileUploadBeforeUploadEvent,
    type FileUploadRemoveEvent,
    type FileUploadSelectEvent,
    type FileUploadUploadEvent,
} from "primevue/fileupload";

import Image from "primevue/image";
import Button from "primevue/button";
import { useConfirm } from "primevue/useconfirm";

import { FormField } from "@primevue/forms";
import type { FormFieldResolverOptions } from "@primevue/forms";
import type { FileReference } from "@/arches_component_lab/widgets/types.ts";
const { $gettext } = useGettext();
const allowedFileTypes = ref();
const currentMax = ref<number | undefined>(undefined);
const initialFiles = ref<number>();
const confirm = useConfirm();
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

onMounted(() => {
    allowedFileTypes.value = props.nodeData.config.imagesOnly ? "image/*" : "*";

    currentMax.value = props.nodeData.config.maxFiles - (props.initialValue?.length ?? 0);
    formFieldRef.value!.field.states.value = {
        newFiles: [],
        deletedFiles: []
    }
});

function resolver(e: FormFieldResolverOptions) {
    validate(e);
}

function select(event: FileUploadSelectEvent) {
    formFieldRef.value!.field.states.value = {
        ...formFieldRef.value!.field.states.value,
        newFiles: event.files
    }
}

function remove(event: FileUploadRemoveEvent) {
    formFieldRef.value!.field.states.value = {
        ...formFieldRef.value!.field.states.value,
        newFiles: event.files
    }

}

function validate(e: FormFieldResolverOptions) {
    console.log("validate", e);
}

function deleteImage(fileId: string) {
    formFieldRef.value!.field.states.value = {
        ...formFieldRef.value!.field.states.value,
        deletedFiles: [...formFieldRef.value!.field.states.value.deletedFiles, fileId]
    }
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
        <div class="uploadedImagesContainer" >
            <div class="uploadedImageRow" v-for="(image, index) in props.initialValue">
                <Image
                    class="uploadedImage"
                    :key="index"
                    :src="image.url"
                    :alt="image.name"></Image>
                <div class="spacer"></div>
                <Button
                    icon="pi pi-trash"
                    :aria-label="$gettext('delete')"
                    severity="danger"
                    outlined
                    @click="deleteImage(image.file_id)"
                />
            </div>
        </div>
        <FileUpload
            accept="image/*"
            :file-limit="currentMax"
            :disabled="currentMax == 0"
            :preview-width="250"
            :with-credentials="true"
            :show-cancel-button="false"
            :show-upload-button="false"
            choose-icon="fa fa-plus-circle"
            :choose-label="$gettext('Upload an image')"
            :name="props.nodeAlias"
            @select="select"
            @remove="remove"
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
<style scoped>
:deep(.uploadedImage img) {
    max-width: 6rem;
    max-height: 6rem;
}

:deep(.uploadedImageRow) {
    display: flex;
}

:deep(.uploadedImageRow .spacer) {
    flex: 1;
}


.uploadedImageContainer {
    display: flex;
}
</style>