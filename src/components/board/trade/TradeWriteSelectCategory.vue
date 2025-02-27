<template>
  <v-text-field
    v-model="categoryName"
    variant="outlined"
    hide-details
    readonly
    append-inner-icon="mdi-chevron-down"
    @click="isOpenMenu = !isOpenMenu"
    rounded="pill"
    :min-width="150"
  >
    <v-menu v-model="isOpenMenu" activator="parent" open-on-hover>
      <v-list rounded="xl">
        <v-list-item
          v-for="(cat, index) in PRODUCT_CATEGORIES[home.lang]"
          :key="index"
          @click="selectCategory(cat, index)"
        >
          {{ cat }}

          <template v-slot:append v-if="cat == categoryName">
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
import { PRODUCT_CATEGORIES } from "../../../messages/pages/board/trade"

const trade = useTradeStore()
const home = useHomeStore()
const categoryName = ref<string>(PRODUCT_CATEGORIES[home.lang][0])
const isOpenMenu = ref<boolean>(false)

// 물품 분류명 선택
function selectCategory(cat: string, index: number): void {
  categoryName.value = cat
  trade.category = index
}
</script>
