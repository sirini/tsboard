<template>
  <v-card-title class="list_title"
    >테스트 게시판
    <span class="info ml-3 pl-3">IT 커뮤니티 사이트들의 게시판을 참조하여 개발중입니다.</span>
  </v-card-title>

  <v-snackbar v-model="board.snackbar" :timeout="board.snackbarTimeout">
    {{ board.snackbarText }}
    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="board.snackbar = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useBoardStore } from "../../store/board"

const board = useBoardStore()
</script>

<style scoped>
.list_title {
  border-bottom: 1px #828282 solid;
}

.info {
  color: #828282;
  font-size: 0.65em;
  border-left: 1px #dddddd solid;
}
</style>
