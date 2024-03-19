<template>
  <v-card-actions>
    <v-btn
      prepend-icon="mdi-new-box"
      @click="comment.resetCommentMode"
      v-show="comment.modifyTarget > 0 || comment.replyTarget > 0"
      >새 댓글 작성으로 설정
      <v-tooltip activator="parent">
        작성중인 본문 내용을 모두 삭제하고, 새 댓글 작성 모드로 변경합니다. (답글달기, 수정하기에서
        새 댓글로 변경하고 싶을 때 클릭!)
      </v-tooltip>
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn append-icon="mdi-chevron-right" @click="save">{{ comment.button }}</v-btn>
  </v-card-actions>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../store/board/gallery/viewer"
import { useCommentStore } from "../../../store/board/comment"
import { BOARD_TYPE } from "../../../interface/board"

const viewer = useViewerStore()
const comment = useCommentStore()

// 댓글 저장하기
async function save(): Promise<void> {
  if (viewer.config.type === BOARD_TYPE.BOARD) {
    comment.saveComment()
  } else {
    comment.boardUid = viewer.config.uid
    comment.postUid = viewer.postUid
    comment.contentWithSyntax = comment.content.replaceAll("\n", "<br />")
    await comment.saveComment()
    await viewer.loadComments()
  }
}
</script>
