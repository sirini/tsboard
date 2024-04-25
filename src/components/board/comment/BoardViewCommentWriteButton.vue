<template>
  <v-card-actions>
    <v-btn
      prepend-icon="mdi-new-box"
      @click="comment.resetCommentMode"
      v-show="comment.modifyTarget > 0 || comment.replyTarget > 0"
      >{{ TEXT[home.lang].SET_NEW_COMMENT }}
      <v-tooltip activator="parent">
        {{ TEXT[home.lang].NEW_COMMENT_TOOLTIP }}
      </v-tooltip>
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn append-icon="mdi-chevron-right" @click="save">{{ comment.button }}</v-btn>
  </v-card-actions>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../store/board/gallery/viewer"
import { useCommentStore } from "../../../store/board/comment"
import { useHomeStore } from "../../../store/home"
import { BOARD_TYPE } from "../../../../server/database/board/const"
import { TEXT } from "../../../messages/components/board/comment/board-view-comment-write-button"

const viewer = useViewerStore()
const comment = useCommentStore()
const home = useHomeStore()

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
