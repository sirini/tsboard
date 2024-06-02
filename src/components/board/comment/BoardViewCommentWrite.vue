<template>
  <board-write-editor
    v-model="comment.content"
    @updateRealHtml="(html: string) => comment.updateRealHtml(html)"
  ></board-write-editor>

  <board-view-comment-write-button></board-view-comment-write-button>
</template>

<script setup lang="ts">
import { useCommentStore } from "../../../store/board/comment"
import BoardWriteEditor from "../write/BoardWriteEditor.vue"
import BoardViewCommentWriteButton from "./BoardViewCommentWriteButton.vue"

const comment = useCommentStore()
</script>
