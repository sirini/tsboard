<template>
  <v-card-actions>
    <v-btn
      prepend-icon="mdi-new-box"
      @click="comment.resetCommentMode"
      v-show="comment.modifyTarget > 0 || comment.replyTarget > 0"
      rounded="pill"
      >{{ TEXT[home.lang].SET_NEW_COMMENT }}
      <v-tooltip activator="parent">
        {{ TEXT[home.lang].NEW_COMMENT_TOOLTIP }}
      </v-tooltip>
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn append-icon="mdi-chevron-right" @click="save" rounded="pill">{{ comment.button }}</v-btn>
  </v-card-actions>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../store/board/gallery.viewer"
import { useCommentStore } from "../../../store/board/comment"
import { useHomeStore } from "../../../store/home"
import { TEXT } from "../../../messages/components/board/comment/board-view-comment-write-button"
import { BOARD } from "../../../interface/board_interface"

const viewer = useViewerStore()
const comment = useCommentStore()
const home = useHomeStore()
const props = defineProps<{
  boardUid: number
  postUid: number
}>()

// 댓글 저장하기
async function save(): Promise<void> {
  comment.boardUid = props.boardUid
  comment.postUid = props.postUid

  if (viewer.config.type === BOARD.GALLERY) {
    comment.contentWithSyntax = comment.content.replaceAll("\n", "<br />")
  }

  await comment.saveComment()
  await viewer.loadComments()
}
</script>
