<script setup lang="ts">
import { useGettext } from "vue3-gettext";
import type { URLNodeValue } from "@/arches_component_lab/datatypes/url/types.ts";

const { $gettext } = useGettext();

defineProps<{ nodeValue: URLNodeValue | null }>();
</script>

<template>
    <a
        v-if="nodeValue?.url"
        :href="nodeValue.url"
    >
        {{ nodeValue.url_label || nodeValue.url }}
    </a>

    <span v-else>
        {{ $gettext("No URL provided") }}
    </span>
</template>
