<template>
  <v-text-field
    v-model="shippingName"
    variant="outlined"
    hide-details
    readonly
    append-inner-icon="mdi-chevron-down"
    @click=""
    rounded="pill"
    :min-width="150"
  >
    <v-menu v-model="isOpenMenu" activator="parent" open-on-hover>
      <v-list rounded="xl">
        <v-list-item
          v-for="(shippingType, index) in SHIPPING_TYPES[home.lang]"
          :key="index"
          @click="selectShippingType(shippingType, index)"
        >
          {{ shippingType }}

          <template v-slot:append v-if="shippingType == shippingName">
            <v-icon size="small">mdi-check-circle</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-text-field>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useHomeStore } from "../../../store/home"
import { ShippingType } from "../../../interface/trade_interface"
import { useTradeStore } from "../../../store/board/trade"
import { SHIPPING_TYPES } from "../../../messages/pages/board/trade"

const trade = useTradeStore()
const home = useHomeStore()
const shippingName = ref<string>(SHIPPING_TYPES[home.lang][0])
const isOpenMenu = ref<boolean>(false)

// 물품 상태 선택
function selectShippingType(type: string, index: number): void {
  shippingName.value = type
  trade.shippingType = index as ShippingType
}
</script>
