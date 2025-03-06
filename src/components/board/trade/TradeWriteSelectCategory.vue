<template>
  <v-text-field
    v-model="trade.item.categoryStr"
    variant="outlined"
    hide-details
    readonly
    append-inner-icon="mdi-chevron-down"
    @click="isOpenMenu = !isOpenMenu"
    rounded="pill"
    :min-width="150"
    :prepend-inner-icon="'mdi-' + PRODUCT_CATEGORY_ICONS[categoryIndex]"
  >
    <v-menu v-model="isOpenMenu" activator="parent" open-on-hover>
      <v-list rounded="xl">
        <v-list-item
          v-for="(cat, index) in PRODUCT_CATEGORIES[home.lang]"
          :key="index"
          :prepend-icon="'mdi-' + PRODUCT_CATEGORY_ICONS[index]"
          @click="selectCategory(cat, index)"
        >
          {{ cat }}

          <template v-slot:append v-if="index == trade.item.productCategory">
            <v-icon size="small">mdi-check-circle</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-text-field>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useTradeStore } from "../../../store/board/trade"
import { useHomeStore } from "../../../store/home"
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_ICONS } from "../../../messages/pages/board/trade"

const trade = useTradeStore()
const home = useHomeStore()
const categoryIndex = ref<number>(0)
const isOpenMenu = ref<boolean>(false)

// 물품 분류명 선택
function selectCategory(cat: string, index: number): void {
  trade.item.categoryStr = cat
  categoryIndex.value = index
  trade.item.productCategory = index
}
</script>
