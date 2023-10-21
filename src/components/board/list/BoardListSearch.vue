<template>
  <v-card width="350">
    <v-list>
      <v-list-item>
        <v-btn-toggle v-model="board.searchOption" size="small" group>
          <v-btn value="subject">제목</v-btn>
          <v-btn value="content">내용</v-btn>
          <v-btn value="both">제목+내용</v-btn>
          <v-btn value="writer">작성자</v-btn>
        </v-btn-toggle>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="board.searchValue"
          class="mt-2"
          variant="outlined"
          placeholder="검색할 내용을 입력하세요"
          :rules="rule"
        ></v-text-field>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useBoardStore } from "../../../store/board"

const board = useBoardStore()
const rule = [
  (value: any) => {
    if (value.length > 1) return true
    return "검색어는 2글자 이상 입력해 주세요."
  },
]
</script>
