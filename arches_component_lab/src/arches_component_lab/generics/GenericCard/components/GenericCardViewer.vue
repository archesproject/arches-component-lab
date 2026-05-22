<script setup lang="ts">
import GenericWidget from "@/arches_component_lab/generics/GenericWidget/GenericWidget.vue";
import { isAliasedNodeData } from "@/arches_component_lab/generics/GenericCard/utils.ts";

import type {
    AliasedNodeData,
    AliasedTileData,
    CardXNodeXWidgetData,
} from "@/arches_component_lab/types.ts";
import type { WidgetMode } from "@/arches_component_lab/widgets/types.ts";

const { cardXNodeXWidgetData, graphSlug, mode, tileData } = defineProps<{
    cardXNodeXWidgetData: CardXNodeXWidgetData[];
    graphSlug: string;
    mode: WidgetMode;
    nodegroupAlias: string;
    tileData?: AliasedTileData;
}>();

function getAliasedNodeData(nodeAlias: string): AliasedNodeData | null {
    const entry = tileData?.aliased_data?.[nodeAlias];
    return isAliasedNodeData(entry) ? entry : null;
}
</script>

<template>
    <div class="viewer">
        <template
            v-for="cardXNodeXWidgetDatum in cardXNodeXWidgetData"
            :key="cardXNodeXWidgetDatum.id"
        >
            <GenericWidget
                v-if="cardXNodeXWidgetDatum.visible"
                :aliased-node-data="
                    getAliasedNodeData(cardXNodeXWidgetDatum.node.alias)
                "
                :card-x-node-x-widget-data="cardXNodeXWidgetDatum"
                :graph-slug="graphSlug"
                :mode="mode"
                :node-alias="cardXNodeXWidgetDatum.node.alias"
            />
        </template>
    </div>
</template>

<style scoped>
.viewer {
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
}
</style>
