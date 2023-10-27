<template>
  <v-card width="500">
    <v-list>
      <v-list-item>
        <v-btn-toggle v-model="util.searchOption" size="small" group>
          <v-btn value="subject">제목</v-btn>
          <v-btn value="content">내용</v-btn>
          <v-btn value="category">카테고리</v-btn>
          <v-btn value="tag">태그</v-btn>
          <v-btn value="writer">작성자</v-btn>
        </v-btn-toggle>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="util.searchValue"
          class="mt-2"
          variant="outlined"
          placeholder="검색할 내용을 입력하세요"
          :rules="write.textRule"
          append-inner-icon="mdi-magnify"
          @click:append-inner="refine"
          @keyup.enter="refine"
        ></v-text-field>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useUtilStore } from "../../../store/util"
import { useWriteStore } from "../../../store/write"

const util = useUtilStore()
const write = useWriteStore()

// 검색어를 정제해서 업데이트하기
function refine(): void {
  const keyword = util.searchValue.replaceAll(util.filter, "")
  util.searchValue = keyword
}
</script>
