<template>
  <v-card width="350">
    <v-list>
      <v-list-item>
        <v-btn-toggle v-model="util.searchOption" size="small" group>
          <v-btn value="subject">제목</v-btn>
          <v-btn value="content">내용</v-btn>
          <v-btn value="both">제목+내용</v-btn>
          <v-btn value="writer">작성자</v-btn>
        </v-btn-toggle>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="util.searchValue"
          class="mt-2"
          variant="outlined"
          placeholder="검색할 내용을 입력하세요"
          :rules="util.textRule"
        ></v-text-field>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useBoardStore } from "../../../store/board"
import { useUtilStore } from "../../../store/util"

const board = useBoardStore()
const util = useUtilStore()
</script>
