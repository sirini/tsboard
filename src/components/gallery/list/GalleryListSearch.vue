<template>
  <v-card width="500">
    <v-list>
      <v-list-item>
        <v-btn-toggle v-model="util.searchOption" size="small" group>
          <v-btn value="subject">사진명</v-btn>
          <v-btn value="content">내용</v-btn>
          <v-btn value="tag">태그</v-btn>
          <v-btn value="writer">작가명</v-btn>
        </v-btn-toggle>
      </v-list-item>

      <v-list-item>
        <v-text-field
          v-model="util.searchValue"
          class="mt-2"
          variant="outlined"
          placeholder="검색할 내용을 입력하세요"
          :rules="editor.textRule"
        ></v-text-field>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useUtilStore } from "../../../store/util"
import { useBoardEditorStore } from "../../../store/board/editor"

const util = useUtilStore()
const editor = useBoardEditorStore()
</script>
