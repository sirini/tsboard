<template>
  <v-toolbar density="compact" class="pl-3 mt-4 comment_menu">
    <board-user-nametag></board-user-nametag>
    <v-spacer></v-spacer>
    <v-chip prepend-icon="mdi-heart">
      3
      <v-tooltip activator="parent" location="top">이 댓글에 좋아요 누르기</v-tooltip>
    </v-chip>
    <v-btn icon
      ><v-icon size="small">mdi-reply</v-icon>
      <v-tooltip activator="parent" location="top">이 댓글에 답글 달기</v-tooltip>
    </v-btn>
    <v-btn icon
      ><v-icon size="small">mdi-pencil-outline</v-icon>
      <v-tooltip activator="parent" location="top"
        >댓글 수정하기 (답글이 있을 시 수정 불가)</v-tooltip
      >
    </v-btn>
    <v-btn icon @click="board.confirmRemoveCommentDialog = true"
      ><v-icon size="small">mdi-trash-can</v-icon>
      <v-tooltip activator="parent" location="top"
        >댓글 삭제하기 (답글이 있을 시 삭제 불가)</v-tooltip
      >
    </v-btn>
  </v-toolbar>
  <v-card elevation="0" rounded="0" class="pa-5 comment"> 여기는 댓글 내용입니다. </v-card>
  <board-view-comment-remove-dialog @remove="remove"></board-view-comment-remove-dialog>
</template>

<script setup lang="ts">
import { useBoardStore } from "../../store/board"
import BoardUserNametag from "./BoardUserNametag.vue"
import BoardViewCommentRemoveDialog from "./BoardViewCommentRemoveDialog.vue"

const board = useBoardStore()

// 댓글 삭제하기 처리
function remove(): void {
  board.snackbarText = "댓글이 정상적으로 삭제(비공개) 되었습니다."
  board.snackbar = true
}
</script>

<style scoped>
.comment_menu {
  border: 1px #dddddd solid;
}
.comment {
  line-height: 1.8em;
}
</style>
