<template>
  <v-list>
    <v-list-item
      class="pa-0"
      :class="reply.uid !== reply.replyUid ? 'ml-8' : ''"
      :prepend-icon="reply.uid !== reply.replyUid ? 'mdi-arrow-right-bottom' : ''"
      v-for="(reply, index) in comment.comments"
      :key="index"
    >
      <v-toolbar
        density="compact"
        class="pl-3 mt-4"
        :color="view.post.writer.uid === reply.writer.uid ? 'orange-lighten-5' : ''"
      >
        <user-nametag
          :name="reply.writer.name"
          :uid="reply.writer.uid"
          :profile="reply.writer.profile"
          :color="view.post.writer.uid === reply.writer.uid ? 'orange-darken-3' : ''"
        ></user-nametag>

        <v-spacer></v-spacer>

        <v-chip
          :prepend-icon="reply.liked ? 'mdi-heart' : 'mdi-heart-outline'"
          @click="comment.like(reply.uid, !reply.liked)"
          :color="
            reply.liked
              ? 'red'
              : view.post.writer.uid === reply.writer.uid
                ? 'orange-darken-3'
                : 'blue-grey'
          "
          class="mr-2"
          >{{ reply.like }}
          <v-tooltip activator="parent" location="top">이 댓글에 좋아요 누르기</v-tooltip>
        </v-chip>

        <v-btn
          :disabled="auth.user.uid < 1"
          icon
          @click="comment.setReplyComment(reply.uid, reply.content)"
          ><v-icon size="small">mdi-reply</v-icon>
          <v-tooltip activator="parent" location="top">이 댓글에 답글 달기</v-tooltip>
        </v-btn>

        <v-btn icon>
          <v-icon size="small">mdi-dots-vertical</v-icon>
          <v-menu activator="parent" open-on-hover>
            <v-list density="compact">
              <v-list-item>
                <v-btn
                  prepend-icon="mdi-pencil"
                  variant="text"
                  :disabled="auth.user.uid !== reply.writer.uid && !auth.user.admin"
                  @click="comment.setModifyComment(reply.uid, reply.content)"
                  >이 댓글 수정하기</v-btn
                >
              </v-list-item>
              <v-list-item>
                <v-btn
                  prepend-icon="mdi-trash-can"
                  variant="text"
                  :disabled="auth.user.uid !== reply.writer.uid && !auth.user.admin"
                  @click="comment.openRemoveCommentDialog(reply.uid)"
                >
                  이 댓글 삭제하기
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-tooltip activator="parent" location="top">추가 작업 메뉴</v-tooltip>
        </v-btn>
      </v-toolbar>

      <v-card elevation="0" rounded="0" class="pa-0 tsboard comment">
        <v-card-text v-html="reply.content" class="content"></v-card-text>
        <v-card-text v-if="reply.modified > 0" class="pa-0 pr-2 modified text-right"
          >{{ util.date(reply.modified, true, true) }} 에 수정되었습니다.</v-card-text
        >
        <v-card-text v-if="reply.content.length < 1" class="pa-0 removed"
          >삭제된 댓글입니다.</v-card-text
        >
      </v-card>
    </v-list-item>
  </v-list>
  <board-view-comment-remove-dialog></board-view-comment-remove-dialog>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useAuthStore } from "../../../store/user/auth"
import { useBoardViewStore } from "../../../store/board/view"
import { useCommentStore } from "../../../store/board/comment"
import { useUtilStore } from "../../../store/util"
import UserNametag from "../../user/UserNametag.vue"
import BoardViewCommentRemoveDialog from "./BoardViewCommentRemoveDialog.vue"
import "../../../assets/board/editor.scss"

const auth = useAuthStore()
const view = useBoardViewStore()
const comment = useCommentStore()
const util = useUtilStore()

onMounted(() => comment.loadCommentList())
</script>

<style scoped>
.comment {
  border: none;
  min-height: 0px;
}

.content {
  font-size: 1em;
  line-height: 1.8em;
}

.heart {
  position: absolute;
  right: 10px;
  bottom: 10px;
}

.modified {
  font-size: 0.8em;
  color: #607d8b;
}

.removed {
  font-size: 0.8em;
  color: #f44336;
}
</style>
