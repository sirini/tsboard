<template>
  <v-card elevation="0" variant="tonal">
    <v-card-text class="pa-0 pt-3 pl-3 pr-3">{{ commentContent }}</v-card-text>
    <v-card-actions class="pa-0 pl-3 pr-3">
      <user-nametag :profile="writerProfile" :uid="writerUid" :name="writerName"></user-nametag>

      <v-spacer></v-spacer>

      <v-chip
        pill
        prepend-icon="mdi-heart"
        size="small"
        class="ml-2 mr-2"
        :disabled="auth.user.uid < 1"
        :color="liked ? 'red' : 'surface-variant'"
        @click="comment.like(commentUid, liked)"
      >
        {{ commentLike }}
        <v-tooltip activator="parent" location="top"> 이 댓글에 좋아요를 표시합니다 </v-tooltip>
      </v-chip>
      <v-btn
        icon
        size="small"
        :disabled="auth.user.uid < 1"
        @click="comment.setReplyComment(commentUid, commentContent, false)"
        ><v-icon>mdi-reply</v-icon>
        <v-tooltip activator="parent" location="top"> 이 댓글에 답글을 작성합니다 </v-tooltip>
      </v-btn>
      <v-btn
        icon
        size="small"
        :disabled="auth.user.uid !== writerUid && !auth.user.admin"
        @click="comment.setModifyComment(commentUid, commentContent)"
        ><v-icon>mdi-pencil</v-icon>
        <v-tooltip activator="parent" location="top"
          >댓글 내용을 수정합니다 (작성자/관리자만 가능)</v-tooltip
        >
      </v-btn>
      <v-btn
        icon
        size="small"
        :disabled="auth.user.uid !== writerUid && !auth.user.admin"
        @click="comment.openRemoveCommentDialog(commentUid)"
        ><v-icon>mdi-trash-can</v-icon>
        <v-tooltip activator="parent" location="top"
          >댓글을 삭제합니다 (답글이 달려있을 경우 삭제 불가, 작성자/관리자만 가능)</v-tooltip
        >
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../../store/auth"
import { useCommentStore } from "../../../store/comment"
import UserNametag from "../../user/UserNametag.vue"

const auth = useAuthStore()
const comment = useCommentStore()
const props = defineProps<{
  commentUid: number
  commentContent: string
  commentLike: number
  writerProfile: string
  writerUid: number
  writerName: string
  liked: boolean
}>()
</script>
