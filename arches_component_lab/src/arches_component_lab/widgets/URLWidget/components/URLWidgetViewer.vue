<script setup lang="ts">
import { useGettext } from "vue3-gettext";
import type { URLNodeValue } from "@/arches_component_lab/datatypes/url/types.ts";

const { $gettext } = useGettext();

defineProps<{ value: URLNodeValue | null }>();
</script>

<template>
    <a
        v-if="value?.url"
        :href="value.url"
    >
        {{ value.url_label || value.url }}
    </a>

    <span v-else>
        {{ $gettext("No URL provided") }}
    </span>
</template>
