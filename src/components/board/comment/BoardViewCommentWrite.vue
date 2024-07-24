<template>
  <board-write-editor
    v-model="comment.content"
    :type="type"
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
import { BoardType } from "../../../interface/board"

const comment = useCommentStore()
const props = defineProps<{ type: BoardType; boardUid: number; postUid: number }>()
</script>
