<script setup lang="ts">
import { computed } from "vue";

import { useGettext } from "vue3-gettext";

import type {
    LanguageValue,
    StringAliasedNodeData,
} from "@/arches_component_lab/datatypes/string/types";

const { value, aliasedNodeData } = defineProps<{
    value?: Record<string, LanguageValue> | null;
    aliasedNodeData?: StringAliasedNodeData | null;
}>();

const { current } = useGettext();

const displayValue = computed(() => {
    if (aliasedNodeData?.display_value) {
        return aliasedNodeData.display_value;
    }
    if (!value) {
        return "";
    }
    return value[current]?.value ?? "";
});
</script>

<template>
    <div>{{ displayValue }}</div>
</template>
