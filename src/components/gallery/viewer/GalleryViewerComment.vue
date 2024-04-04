<template>
  <v-card
    elevation="0"
    variant="tonal"
    :color="viewer.post.writer.uid === writerUid ? 'orange' : 'blue-grey'"
  >
    <v-card-text class="pa-0 pt-3 pl-3 pr-3" v-html="commentContent"></v-card-text>
    <v-card-actions class="pa-0 pl-3 pr-3">
      <user-nametag
        :profile="writerProfile"
        :uid="writerUid"
        :name="writerName"
        :color="viewer.post.writer.uid === writerUid ? 'orange-darken-3' : ''"
      ></user-nametag>

      <v-spacer></v-spacer>

      <v-chip
        pill
        prepend-icon="mdi-heart"
        size="small"
        class="ml-2 mr-2"
        :disabled="auth.user.uid < 1"
        :color="liked ? 'red' : ''"
        @click="like"
      >
        {{ commentLike }}
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].LIKE_TOOLTIP }}</v-tooltip>
      </v-chip>

      <v-btn
        icon
        size="small"
        :disabled="auth.user.uid < 1"
        @click="comment.setReplyComment(commentUid, commentContent, false)"
        ><v-icon>mdi-reply</v-icon>
        <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].REPLY_TOOLTIP }}</v-tooltip>
      </v-btn>

      <v-btn
        icon
        size="small"
        :disabled="auth.user.uid !== writerUid && !auth.user.admin"
        @click="comment.setModifyComment(commentUid, commentContent)"
        ><v-icon>mdi-pencil</v-icon>
        <v-tooltip activator="parent" location="top">{{
          TEXT[home.lang].MODIFY_TOOLTIP
        }}</v-tooltip>
      </v-btn>

      <v-btn
        icon
        size="small"
        :disabled="auth.user.uid !== writerUid && !auth.user.admin"
        @click="remove"
        ><v-icon>mdi-trash-can</v-icon>
        <v-tooltip activator="parent" location="top">{{
          TEXT[home.lang].REMOVE_TOOLTIP
        }}</v-tooltip>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../store/board/gallery/viewer"
import { useAuthStore } from "../../../store/user/auth"
import { useCommentStore } from "../../../store/board/comment"
import { useHomeStore } from "../../../store/home"
import UserNametag from "../../user/UserNametag.vue"
import { TEXT } from "../../../messages/components/gallery/viewer/gallery-viewer-comment"

const viewer = useViewerStore()
const auth = useAuthStore()
const comment = useCommentStore()
const home = useHomeStore()
const props = defineProps<{
  commentUid: number
  commentContent: string
  commentLike: number
  writerProfile: string
  writerUid: number
  writerName: string
  liked: boolean
}>()

// 댓글 좋아요 누르기
async function like(): Promise<void> {
  comment.boardUid = viewer.config.uid
  await comment.like(props.commentUid, !props.liked)
  await viewer.loadComments()
}

// 댓글 삭제하기
async function remove(): Promise<void> {
  comment.boardUid = viewer.config.uid
  comment.openRemoveCommentDialog(props.commentUid)
}
</script>
