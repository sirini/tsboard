<template>
  <v-text-field
    v-model="conditionName"
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
          v-for="(condition, index) in PRODUCT_CONDITIONS[home.lang]"
          :key="index"
          @click="selectCondition(condition, index)"
        >
          {{ condition }}

          <template v-slot:append v-if="condition == conditionName">
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
import { ProductCondition } from "../../../interface/trade_interface"
import { useTradeStore } from "../../../store/board/trade"
import { PRODUCT_CONDITIONS } from "../../../messages/pages/board/trade"

const trade = useTradeStore()
const home = useHomeStore()
const conditionName = ref<string>(PRODUCT_CONDITIONS[home.lang][0])
const isOpenMenu = ref<boolean>(false)

// 물품 상태 선택
function selectCondition(condition: string, index: number): void {
  conditionName.value = condition
  trade.productCondition = index as ProductCondition
}
</script>
