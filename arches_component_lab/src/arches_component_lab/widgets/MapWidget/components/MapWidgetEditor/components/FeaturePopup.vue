<script setup lang="ts">
import { computed, ref, watch } from "vue";

import arches from "arches";
import Skeleton from "primevue/skeleton";
import { useGettext } from "vue3-gettext";

import type { MapGeoJSONFeature } from "maplibre-gl";

interface ResourceDescriptor {
    displayname: string;
    displaydescription: string;
    map_popup: string;
    graph_name: string;
    permissions: { can_edit_resource_instance?: boolean };
}

const props = defineProps<{ features: MapGeoJSONFeature[] }>();

const { $gettext } = useGettext();

const index = ref(0);
const loading = ref(false);
const descriptor = ref<ResourceDescriptor | null>(null);

const feature = computed(() => props.features[index.value]);
const resourceId = computed(
    () => feature.value?.properties?.resourceinstanceid ?? null,
);
const total = computed(() => props.features.length);
const isInitialLoading = computed(() => loading.value && !descriptor.value);

let abortController: AbortController | null = null;

watch(
    resourceId,
    async (id) => {
        abortController?.abort();
        if (!id) return;
        abortController = new AbortController();
        loading.value = true;
        try {
            const response = await fetch(
                arches.urls.resource_descriptors + id,
                {
                    signal: abortController.signal,
                },
            );
            if (response.ok) {
                descriptor.value = await response.json();
            }
        } catch (error) {
            if ((error as Error).name !== "AbortError") throw error;
        } finally {
            loading.value = false;
        }
    },
    { immediate: true },
);

function prev() {
    index.value = (index.value - 1 + total.value) % total.value;
}

function next() {
    index.value = (index.value + 1) % total.value;
}
</script>

<template>
    <div class="popup">
        <div class="popup-title-bar">
            <button
                v-if="total > 1"
                class="popup-nav-btn"
                @click="prev"
            >
                <i class="fa fa-angle-left" />
            </button>
            <div class="popup-title">
                <Skeleton
                    v-if="isInitialLoading"
                    height="1rem"
                    width="60%"
                />
                <template v-else>
                    {{ descriptor?.displayname ?? resourceId }}
                </template>
            </div>
            <button
                v-if="total > 1"
                class="popup-nav-btn"
                @click="next"
            >
                <i class="fa fa-angle-right" />
            </button>
        </div>

        <div class="popup-body">
            <template v-if="isInitialLoading">
                <Skeleton
                    height="1rem"
                    class="popup-skeleton-row"
                />
                <Skeleton
                    height="1rem"
                    width="80%"
                    class="popup-skeleton-row"
                />
                <Skeleton
                    height="1rem"
                    width="60%"
                    class="popup-skeleton-row"
                />
            </template>
            <template v-else-if="descriptor">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div
                    v-if="descriptor.map_popup"
                    class="popup-html-content"
                    v-html="descriptor.map_popup"
                />
                <div class="popup-metadata-block">
                    <div
                        v-if="descriptor.graph_name"
                        class="popup-metadata"
                    >
                        <span>{{ $gettext("Resource Model") }} </span>
                        <span class="popup-metadata-value">{{
                            descriptor.graph_name
                        }}</span>
                    </div>
                    <div
                        v-if="resourceId"
                        class="popup-metadata"
                    >
                        <span>{{ $gettext("ID") }}: </span>
                        <span class="popup-metadata-value popup-id-value">{{
                            resourceId
                        }}</span>
                    </div>
                </div>
            </template>
        </div>

        <div class="popup-footer">
            <div class="popup-footer-links">
                <a
                    v-if="resourceId"
                    :href="arches.urls.resource_report + resourceId"
                    target="_blank"
                >
                    <i class="ion-document-text" />
                    {{ $gettext("Report") }}
                </a>
                <a
                    v-if="descriptor?.permissions?.can_edit_resource_instance"
                    :href="arches.urls.resource_editor + resourceId"
                    target="_blank"
                >
                    <i class="ion-ios-refresh-empty" />
                    {{ $gettext("Edit") }}
                </a>
            </div>
            <div
                v-if="total > 1"
                class="popup-counter"
            >
                <div class="popup-counter-badge">{{ index + 1 }}</div>
                <span>{{ $gettext("of") }}</span>
                <div>{{ total }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.popup {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-size: 1.375rem;
    border: 0.0625rem solid var(--p-menubar-border-color);
    border-radius: 0.25rem;
    overflow: hidden;
    background: var(--p-content-background);
    color: var(--p-content-color);
}

.popup-title-bar {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 3.5rem 0.5rem 0.625rem;
    border-bottom: 0.0625rem solid var(--p-menubar-border-color);
    min-height: 2.5rem;
}

.popup-title {
    flex: 1;
    min-width: 0;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.popup-nav-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    border: 0.0625rem solid var(--p-menubar-border-color);
    background: none;
    cursor: pointer;
    font-size: 1.875rem;
    font-weight: 600;
    color: inherit;
    padding: 0;
    line-height: 1;
}

.popup-nav-btn:hover {
    background: var(--p-button-secondary-hover-background);
    color: var(--p-button-secondary-hover-color);
}

.popup-body {
    flex: 1;
    padding: 0.75rem 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.popup-skeleton-row {
    display: block;
}

.popup-html-content {
    margin-bottom: 0.5rem;
}

.popup-metadata-block {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 1.125rem;
    opacity: 0.75;
}

.popup-metadata-value {
    color: var(--p-primary-color);
}

.popup-id-value {
    word-break: break-all;
}

.popup-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    border-top: 0.0625rem solid var(--p-menubar-border-color);
    background: var(--p-button-secondary-hover-background);
}

.popup-footer-links {
    display: flex;
    gap: 0.75rem;
}

.popup-footer-links a {
    color: var(--p-primary-color);
    font-weight: 500;
    text-decoration: none;
}

.popup-footer-links a:hover {
    text-decoration: underline;
}

.popup-counter {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-weight: 500;
    font-size: 1rem;
}

.popup-counter-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: var(--p-primary-200);
    border: 0.0625rem solid var(--p-primary-500);
    color: var(--p-primary-contrast-color);
    font-size: 1rem;
}
</style>
