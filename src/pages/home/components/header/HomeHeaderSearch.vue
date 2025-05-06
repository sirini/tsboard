<template>
  <v-card
    elevation="0"
    rounded="0"
    :width="isSmallScreen ? home.width : 500"
    :color="COLOR.HOME.MAIN"
  >
    <v-list :bg-color="COLOR.HOME.MAIN">
      <v-list-item>
        <template v-slot:prepend>
          <v-text-field
            v-model="optionTitle"
            hide-details
            variant="outlined"
            density="compact"
            class="mr-2"
            rounded="pill"
            readonly
            append-inner-icon="mdi-chevron-down"
            width="120"
          >
            <v-menu activator="parent">
              <v-list rounded="xl">
                <v-list-item
                  @click="selectSearchOption(SEARCH.TITLE as Search)"
                  :class="home.option === (SEARCH.TITLE as Search) ? 'selected' : ''"
                  >{{ TEXT[home.lang].TITLE }}
                  <template v-slot:append v-if="home.option === (SEARCH.TITLE as Search)">
                    <v-icon>mdi-check</v-icon>
                  </template>
                </v-list-item>

                <v-list-item
                  @click="selectSearchOption(SEARCH.CONTENT as Search)"
                  :class="home.option === (SEARCH.CONTENT as Search) ? 'selected' : ''"
                  >{{ TEXT[home.lang].CONTENT }}
                  <template v-slot:append v-if="home.option === (SEARCH.CONTENT as Search)">
                    <v-icon>mdi-check</v-icon>
                  </template>
                </v-list-item>

                <v-list-item
                  @click="selectSearchOption(SEARCH.WRITER as Search)"
                  :class="home.option === (SEARCH.WRITER as Search) ? 'selected' : ''"
                  >{{ TEXT[home.lang].WRITER }}
                  <template v-slot:append v-if="home.option === (SEARCH.WRITER as Search)">
                    <v-icon>mdi-check</v-icon>
                  </template>
                </v-list-item>

                <v-list-item
                  @click="selectSearchOption(SEARCH.TAG as Search)"
                  :class="home.option === (SEARCH.TAG as Search) ? 'selected' : ''"
                  >{{ TEXT[home.lang].TAG }}
                  <template v-slot:append v-if="home.option === (SEARCH.TAG as Search)">
                    <v-icon>mdi-check</v-icon>
                  </template>
                </v-list-item>

                <v-list-item
                  @click="selectSearchOption(SEARCH.IMAGEDESC as Search)"
                  :class="home.option === (SEARCH.IMAGEDESC as Search) ? 'selected' : ''"
                  >{{ TEXT[home.lang].IMAGEDESC }}
                  <template v-slot:append v-if="home.option === (SEARCH.IMAGEDESC as Search)">
                    <v-icon>mdi-check</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-text-field>
        </template>

        <v-text-field
          v-model="home.keyword"
          hide-details
          variant="outlined"
          density="compact"
          rounded="pill"
          :color="COLOR.HOME.MAIN"
          :placeholder="TEXT[home.lang].PLACEHOLDER"
          prepend-inner-icon="mdi-restore"
          @click:prepend-inner="home.resetSearchKeyword"
          append-inner-icon="mdi-magnify"
          @click:append-inner="home.enterSearchPosts"
          @keydown.enter="home.enterSearchPosts"
          @keyup="home.searchPosts"
        >
          <v-tooltip activator="parent"
            >{{ TEXT[home.lang].TOOLTIP }}
            <v-icon>mdi-restore</v-icon>
          </v-tooltip>

          <v-menu activator="parent">
            <v-list v-show="home.keywordHistories.length > 0">
              <v-list-subheader>이전에 입력한 검색어</v-list-subheader>
              <v-list-item
                v-for="(keyword, index) in home.keywordHistories"
                :key="index"
                prepend-icon="mdi-history"
                @click="home.selectKeywordFromHistory(keyword)"
                >{{ keyword }}</v-list-item
              >
            </v-list>
          </v-menu>
        </v-text-field>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { SEARCH, Search } from "../../../../interface/board_interface"
import { TEXT } from "../../../../messages/pages/home/components/header/home-header-search"
import { useHomeStore } from "../../../../store/home"
import { COLOR } from "../../../../../tsboard.config"

const home = useHomeStore()
const optionTitle = ref<string>(TEXT[home.lang].TITLE)
const props = defineProps<{
  isSmallScreen: boolean
}>()

// 검색 옵션 선택하기
function selectSearchOption(option: Search): void {
  home.option = option
  if (option === (SEARCH.TITLE as Search)) {
    optionTitle.value = TEXT[home.lang].TITLE
  } else if (option === (SEARCH.CONTENT as Search)) {
    optionTitle.value = TEXT[home.lang].CONTENT
  } else if (option === (SEARCH.WRITER as Search)) {
    optionTitle.value = TEXT[home.lang].WRITER
  } else if (option === (SEARCH.IMAGEDESC as Search)) {
    optionTitle.value = TEXT[home.lang].IMAGEDESC
  } else {
    optionTitle.value = TEXT[home.lang].TAG
  }
}
</script>

<style scoped>
.selected {
  font-weight: bold;
  background-color: #eceff1;
}
</style>
