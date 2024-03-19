<template>
  <v-card elevation="0" rounded="0" class="mt-2">
    <board-write-editor
      v-model="comment.content"
      @updateRealHtml="(html: string) => comment.updateRealHtml(html)"
    ></board-write-editor>

    <board-view-comment-write-button></board-view-comment-write-button>
  </v-card>
</template>

<script setup lang="ts">
import { useCommentStore } from "../../../store/board/comment"
import BoardWriteEditor from "../write/BoardWriteEditor.vue"
import BoardViewCommentWriteButton from "./BoardViewCommentWriteButton.vue"

const comment = useCommentStore()
</script>
