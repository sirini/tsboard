<template>
  <v-card max-width="500">
    <v-list>
      <v-list-item>
        <v-btn-toggle v-model="list.option" size="small" group :color="home.color.header">
          <v-btn :value="SEARCH.TITLE">{{ TEXT[home.lang].TITLE }}</v-btn>
          <v-btn :value="SEARCH.CONTENT">{{ TEXT[home.lang].CONTENT }}</v-btn>
          <v-btn :value="SEARCH.WRITER">{{ TEXT[home.lang].WRITER }}</v-btn>
          <v-btn :value="SEARCH.TAG">{{ TEXT[home.lang].TAG }}</v-btn>
        </v-btn-toggle>
      </v-list-item>

      <v-list-item>
        <v-text-field
          v-model="list.keyword"
          class="mt-2"
          variant="outlined"
          :placeholder="TEXT[home.lang].FILL_SEARCH"
          append-inner-icon="mdi-magnify"
          prepend-inner-icon="mdi-restore"
          @click:prepend-inner="list.resetSearchKeyword"
          @click:append-inner="list.enterSearchKeyword"
          @keydown.enter="list.enterSearchKeyword"
        >
          <v-menu activator="parent">
            <v-list v-show="list.keywordHistories.length > 0">
              <v-list-item
                v-for="(keyword, index) in list.keywordHistories"
                :key="index"
                prepend-icon="mdi-history"
                @click="list.selectKeywordFromHistory(keyword)"
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
import { SEARCH } from "../../../interface/board_interface"
import { TEXT } from "../../../messages/pages/board/list"
import { useBoardListStore } from "../../../store/board/list"
import { useHomeStore } from "../../../store/home"

const list = useBoardListStore()
const home = useHomeStore()
</script>
