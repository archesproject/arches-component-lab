<script setup lang="ts">
import Image from "primevue/image";
import Button from "primevue/button";

import { REMOVE } from "@/arches_component_lab/datatypes/file-list/constants.ts";

import type { PropType } from "vue";
import type { FileReference } from "@/arches_component_lab/datatypes/file-list/types.ts";

interface FileListProps {
    files: FileReference[];
}

const { files } = defineProps({
    files: {
        type: Array as PropType<FileListProps["files"]>,
        required: true,
    },
});

interface FileListEmits {
    (
        e: typeof REMOVE,
        fileReference: FileReference,
        fileIndex: number,
        event: Event,
    ): void;
}

const emit: FileListEmits = defineEmits([REMOVE]);
</script>

<template>
    <div
        v-if="files.length"
        @click.stop.prevent
    >
        <div
            v-for="(fileReference, fileIndex) in files"
            :key="fileReference.file_id"
            class="file-list"
        >
            <Image
                image-class="image-list-image"
                :src="fileReference.url"
                :alt="fileReference.name"
            />
            <Button
                icon="pi pi-times"
                severity="danger"
                outlined
                rounded
                class="delete-button"
                @click="
                    (event) => emit(REMOVE, fileReference, fileIndex, event)
                "
            />
        </div>
    </div>
</template>

<style scoped>
.file-list {
    display: flex;
    width: 100%;
}

:deep(.image-list-image) {
    flex: 1 1 auto;
    max-width: 100%;
    height: auto;
}

.delete-button {
    flex: 0 0 auto;
}
</style>
