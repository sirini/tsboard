<template>
  <v-chip
    size="small"
    variant="text"
    :color="COLOR.HOME.MAIN"
    :prepend-icon="'mdi-' + PRODUCT_CATEGORY_ICONS[trade.item.productCategory]"
    class="mr-3"
    >{{ trade.item.categoryStr }}</v-chip
  >

  <v-chip
    size="small"
    variant="text"
    :color="COLOR.HOME.MAIN"
    prepend-icon="mdi-barcode"
    class="mr-3"
    >{{ trade.item.brand }}</v-chip
  >

  <v-chip
    size="small"
    variant="text"
    :color="COLOR.HOME.MAIN"
    prepend-icon="mdi-broom"
    class="mr-3"
  >
    {{ trade.item.conditionStr }}
  </v-chip>

  <v-chip
    size="small"
    variant="text"
    :color="COLOR.HOME.MAIN"
    :prepend-icon="
      trade.item.shippingType === SHIPPING_TYPE.F2F ? 'mdi-handshake-outline' : 'mdi-truck'
    "
    class="mr-3"
    >{{ trade.item.shippingStr }}</v-chip
  >

  <v-chip
    size="small"
    variant="text"
    :color="COLOR.HOME.MAIN"
    prepend-icon="mdi-map-marker-outline"
    >{{ trade.item.location }}</v-chip
  >
</template>

<script setup lang="ts">
import { COLOR } from "../../../../tsboard.config"
import { SHIPPING_TYPE } from "../../../interface/trade_interface"
import { PRODUCT_CATEGORY_ICONS } from "../../../messages/pages/board/trade"
import { useTradeStore } from "../../../store/board/trade"

const trade = useTradeStore()
</script>
