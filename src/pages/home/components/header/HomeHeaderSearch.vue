<template>
  <v-card
    elevation="0"
    rounded="0"
    :width="isSmallScreen ? home.width : 500"
    :color="home.color.header"
  >
    <v-list :bg-color="home.color.header">
      <v-list-item>
        <template v-slot:prepend>
          <v-text-field
            v-model="optionTitle"
            hide-details
            variant="outlined"
            density="compact"
            class="mr-2"
            readonly
            append-inner-icon="mdi-chevron-down"
            width="120"
          >
            <v-menu activator="parent">
              <v-list>
                <v-list-item
                  @click="selectSearchOption(SEARCH_OPTION.TITLE as SearchOption)"
                  :class="home.option === (SEARCH_OPTION.TITLE as SearchOption) ? 'selected' : ''"
                  >{{ TEXT[home.lang].TITLE }}
                  <template
                    v-slot:append
                    v-if="home.option === (SEARCH_OPTION.TITLE as SearchOption)"
                  >
                    <v-icon>mdi-check</v-icon>
                  </template>
                </v-list-item>

                <v-list-item
                  @click="selectSearchOption(SEARCH_OPTION.CONTENT as SearchOption)"
                  :class="home.option === (SEARCH_OPTION.CONTENT as SearchOption) ? 'selected' : ''"
                  >{{ TEXT[home.lang].CONTENT }}
                  <template
                    v-slot:append
                    v-if="home.option === (SEARCH_OPTION.CONTENT as SearchOption)"
                  >
                    <v-icon>mdi-check</v-icon>
                  </template>
                </v-list-item>

                <v-list-item
                  @click="selectSearchOption(SEARCH_OPTION.WRITER as SearchOption)"
                  :class="home.option === (SEARCH_OPTION.WRITER as SearchOption) ? 'selected' : ''"
                  >{{ TEXT[home.lang].WRITER }}
                  <template
                    v-slot:append
                    v-if="home.option === (SEARCH_OPTION.WRITER as SearchOption)"
                  >
                    <v-icon>mdi-check</v-icon>
                  </template>
                </v-list-item>

                <v-list-item
                  @click="selectSearchOption(SEARCH_OPTION.TAG as SearchOption)"
                  :class="home.option === (SEARCH_OPTION.TAG as SearchOption) ? 'selected' : ''"
                  >{{ TEXT[home.lang].TAG }}
                  <template
                    v-slot:append
                    v-if="home.option === (SEARCH_OPTION.TAG as SearchOption)"
                  >
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
          :color="home.color.header"
          :placeholder="TEXT[home.lang].PLACEHOLDER"
          prepend-inner-icon="mdi-restore"
          @click:prepend-inner="home.resetSearchKeyword"
          append-inner-icon="mdi-magnify"
          @click:append-inner="home.enterSearchPosts"
          @keydown.enter="home.enterSearchPosts"
          @input="home.searchPosts"
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
import { SEARCH_OPTION } from "../../../../../server/database/board/const"
import { SearchOption } from "../../../../interface/board"
import { TEXT } from "../../../../messages/pages/home/components/header/home-header-search"
import { useHomeStore } from "../../../../store/home"

const home = useHomeStore()
const optionTitle = ref<string>(TEXT[home.lang].TITLE)
const props = defineProps<{
  isSmallScreen: boolean
}>()

// 검색 옵션 선택하기
function selectSearchOption(option: SearchOption): void {
  home.option = option
  if (option === (SEARCH_OPTION.TITLE as SearchOption)) {
    optionTitle.value = TEXT[home.lang].TITLE
  } else if (option === (SEARCH_OPTION.CONTENT as SearchOption)) {
    optionTitle.value = TEXT[home.lang].CONTENT
  } else if (option === (SEARCH_OPTION.WRITER as SearchOption)) {
    optionTitle.value = TEXT[home.lang].WRITER
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
