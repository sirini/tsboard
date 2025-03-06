<template>
  <v-chip
    size="small"
    variant="text"
    :color="COLOR.HOME.MAIN"
    :prepend-icon="'mdi-' + PRODUCT_CATEGORY_ICONS[item.productCategory]"
    >{{ item.categoryStr }}</v-chip
  >

  <v-chip size="small" variant="text" :color="COLOR.HOME.MAIN" prepend-icon="mdi-barcode">{{
    item.brand
  }}</v-chip>

  <v-chip size="small" variant="text" :color="COLOR.HOME.MAIN" prepend-icon="mdi-broom">
    {{ item.conditionStr }}
  </v-chip>

  <v-chip
    size="small"
    variant="text"
    :color="COLOR.HOME.MAIN"
    :prepend-icon="item.shippingType === SHIPPING_TYPE.F2F ? 'mdi-handshake-outline' : 'mdi-truck'"
    >{{ item.shippingStr }}</v-chip
  >

  <v-chip
    size="small"
    variant="text"
    :color="COLOR.HOME.MAIN"
    prepend-icon="mdi-map-marker-outline"
    >{{ item.location }}</v-chip
  >
</template>

<script setup lang="ts">
import { COLOR } from "../../../../tsboard.config"
import { SHIPPING_TYPE, TradeItem } from "../../../interface/trade_interface"
import { PRODUCT_CATEGORY_ICONS } from "../../../messages/pages/board/trade"

const props = defineProps<{
  item: TradeItem
}>()
</script>
