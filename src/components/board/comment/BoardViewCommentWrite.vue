<template>
  <board-write-editor
    v-model="comment.content"
    :type="type"
    :loading="comment.loading"
    @updateRealHtml="(html: string) => comment.updateRealHtml(html)"
  ></board-write-editor>

  <board-view-comment-write-button
    :board-uid="boardUid"
    :post-uid="postUid"
  ></board-view-comment-write-button>
</template>

<script setup lang="ts">
import { useCommentStore } from "../../../store/board/comment"
import BoardWriteEditor from "../write/BoardWriteEditor.vue"
import BoardViewCommentWriteButton from "./BoardViewCommentWriteButton.vue"
import { Board } from "../../../interface/board_interface"

const comment = useCommentStore()
const props = defineProps<{ type: Board; boardUid: number; postUid: number }>()
</script>
