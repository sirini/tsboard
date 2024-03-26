<template>
  <v-card elevation="0" rounded="0" width="600" :color="home.color.header">
    <v-row no-gutters>
      <v-col cols="2" class="mr-3">
        <v-text-field
          v-model="optionTitle"
          hide-details
          variant="plain"
          density="compact"
          readonly
          append-inner-icon="mdi-chevron-down"
        >
          <v-menu activator="parent" open-on-hover>
            <v-list>
              <v-list-item
                v-for="(opt, index) in options"
                :key="index"
                @click="selectSearchOption(opt.option)"
                :class="home.option === opt.option ? 'selected' : ''"
                >{{ opt.name }}
                <template v-slot:append v-if="home.option === opt.option">
                  <v-icon>mdi-check</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="home.keyword"
          hide-details
          variant="outlined"
          density="compact"
          :color="home.color.header"
          placeholder="검색어를 입력하세요"
          prepend-inner-icon="mdi-restore"
          @click:prepend-inner="home.resetSearchKeyword"
          append-inner-icon="mdi-magnify"
          @click:append-inner="home.searchPosts"
          @input="home.searchPosts"
        >
          <v-tooltip activator="parent"
            >검색어를 초기화하려면 <v-icon>mdi-restore</v-icon> 아이콘을 클릭하세요!</v-tooltip
          >
        </v-text-field>
      </v-col>
    </v-row>
  </v-card>

  <v-spacer></v-spacer>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useHomeStore } from "../../../../store/home"
import { SEARCH_OPTION, SearchOption } from "../../../../interface/board"

const home = useHomeStore()
const optionTitle = ref<string>("제목")
const options = [
  { name: "제목", option: SEARCH_OPTION.TITLE as SearchOption },
  { name: "내용", option: SEARCH_OPTION.CONTENT as SearchOption },
  { name: "작성자", option: SEARCH_OPTION.WRITER as SearchOption },
  { name: "태그", option: SEARCH_OPTION.TAG as SearchOption },
]

// 검색 옵션 선택하기
function selectSearchOption(option: SearchOption): void {
  home.option = option
  optionTitle.value = options.filter((e) => e.option === option)[0].name
}
</script>

<style scoped>
.selected {
  font-weight: bold;
  background-color: #eceff1;
}
</style>
