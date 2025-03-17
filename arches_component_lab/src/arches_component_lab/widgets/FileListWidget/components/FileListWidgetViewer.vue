<script setup lang="ts">
import { computed } from "vue";
import { Image, Galleria } from "primevue";
import type { FileReference } from "@/arches_component_lab/widgets/types.ts";

const props = defineProps<{
    value: FileReference[] | null | undefined;
    widgetData: {
        config: object;
    };
}>();

const images = computed(() => {
    const val = props.value?.map((x) => {
        return {
            thumbnailImageSrc: `http://localhost:8059/${x.url}`,
            itemImageSrc: `http://localhost:8059/${x.url}`,
            alt: x.altText,
            title: x.title,
        };
    });
    console.log(val);
    return val;
});
</script>

<template>
    <Galleria
        :value="images"
        :show-thumbnails="images && images?.length > 1"
    >
        <template #item="slotProps">
            <Image
                class="mainImage"
                :src="slotProps.item.itemImageSrc"
                :alt="slotProps.item.alt"
            />
        </template>
        <template
            v-if="images && images?.length > 1"
            #thumbnail="slotProps"
        >
            <Image
                class="thumbnailImage"
                :src="slotProps.item.itemImageSrc"
                :alt="slotProps.item.alt"
            />
        </template>
    </Galleria>
</template>

<style scoped>
:deep(.mainImage) {
    display: flex;
    justify-content: center;
    align-items: center;
}

:deep(.mainImage img) {
    max-width: 100%;
}

:deep(.thumbnailImage img) {
    max-height: 5rem;
}
</style>
