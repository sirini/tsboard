<template>
  <v-list>
    <v-list-item
      class="pa-0"
      v-for="(reply, index) in comment.comments"
      :class="reply.uid !== reply.replyUid ? 'ml-12' : ''"
      :key="index"
    >
      <v-toolbar
        density="compact"
        class="pl-3 mt-4"
        rounded="pill"
        :color="setToolbarColor(view.post.writer.uid, reply.writer.uid)"
      >
        <user-nametag
          :name="reply.writer.name"
          :uid="reply.writer.uid"
          :profile="reply.writer.profile"
          :color="setNametagColor(view.post.writer.uid, reply.writer.uid)"
          size="small"
        ></user-nametag>

        <v-spacer></v-spacer>

        <v-chip
          :prepend-icon="reply.liked ? 'mdi-heart' : 'mdi-heart-outline'"
          @click="comment.like(reply.uid, !reply.liked)"
          :color="reply.liked ? 'red' : ''"
          class="mr-2"
          size="small"
          >{{ reply.like }}
          <v-tooltip activator="parent" location="top">{{
            TEXT[home.lang].LIKE_TOOLTIP
          }}</v-tooltip>
        </v-chip>

        <v-btn
          :disabled="auth.user.uid < 1"
          icon
          size="small"
          @click="comment.setReplyComment(reply.uid, reply.content)"
          rounded="pill"
          ><v-icon size="small">mdi-reply</v-icon>
          <v-tooltip activator="parent" location="top">{{
            TEXT[home.lang].REPLY_TOOLTIP
          }}</v-tooltip>
        </v-btn>

        <v-btn icon size="small">
          <v-icon>mdi-dots-vertical</v-icon>
          <v-menu activator="parent" open-on-hover>
            <v-list density="compact">
              <v-list-item>
                <v-btn
                  prepend-icon="mdi-pencil"
                  variant="text"
                  :disabled="auth.user.uid !== reply.writer.uid && !auth.user.admin"
                  @click="comment.setModifyComment(reply.uid, reply.content)"
                  >{{ TEXT[home.lang].MODIFY }}</v-btn
                >
              </v-list-item>
              <v-list-item>
                <v-btn
                  prepend-icon="mdi-trash-can"
                  variant="text"
                  :disabled="auth.user.uid !== reply.writer.uid && !auth.user.admin"
                  @click="comment.openRemoveCommentDialog(reply.uid)"
                >
                  {{ TEXT[home.lang].REMOVE }}
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-tooltip activator="parent" location="top">{{
            TEXT[home.lang].MENU_TOOLTIP
          }}</v-tooltip>
        </v-btn>
      </v-toolbar>

      <v-card elevation="0" rounded="0" class="pa-0 tsboard comment">
        <v-card-text v-html="reply.content" class="content"></v-card-text>
        <v-card-text v-if="reply.modified > 0" class="pa-0 pr-2 modified text-right"
          >{{ util.date(reply.modified, true, true) }} {{ TEXT[home.lang].MODIFIED }}</v-card-text
        >
        <v-card-text v-if="reply.content.length < 1" class="pa-0 removed">{{
          TEXT[home.lang].REMOVED
        }}</v-card-text>
      </v-card>
    </v-list-item>
  </v-list>
  <board-view-comment-remove-dialog></board-view-comment-remove-dialog>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import "../../../assets/board/editor.scss"
import { TEXT } from "../../../messages/components/board/comment/board-view-comment-list"
import { useCommentStore } from "../../../store/board/comment"
import { useBoardViewStore } from "../../../store/board/view"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"
import UserNametag from "../../user/UserNametag.vue"
import BoardViewCommentRemoveDialog from "./BoardViewCommentRemoveDialog.vue"
import { BOARD } from "../../../interface/board_interface"
import { COLOR } from "../../../../tsboard.config"

const route = useRoute()
const auth = useAuthStore()
const view = useBoardViewStore()
const comment = useCommentStore()
const util = useUtilStore()
const home = useHomeStore()

onMounted(() => comment.loadCommentList())
watch(
  () => route.params?.no,
  () => comment.loadCommentList(),
)

// 댓글의 툴바 색상을 상황에 맞게 변경하기
function setToolbarColor(writerUid: number, commenterUid: number): string {
  let color = COLOR.HOME.TOOLBAR
  if (view.config.type === BOARD.BLOG) {
    color = COLOR.COMMENT.TOOLBAR.BLOG
    if (writerUid === commenterUid) {
      color = COLOR.COMMENT.TOOLBAR.BLOG_WRITER
    }
  } else if (writerUid === commenterUid) {
    color = COLOR.COMMENT.TOOLBAR.BOARD_WRITER
  }
  return color
}

// 댓글 작성자의 네임택 색상을 상황에 맞게 변경하기
function setNametagColor(writerUid: number, commenterUid: number): string {
  let color = COLOR.HOME.TOOLBAR
  if (view.config.type === BOARD.BLOG) {
    color = COLOR.COMMENT.NAMETAG.BLOG
    if (writerUid === commenterUid) {
      color = COLOR.COMMENT.NAMETAG.BLOG_WRITER
    }
  } else if (writerUid === commenterUid) {
    color = COLOR.COMMENT.NAMETAG.BOARD_WRITER
  }
  return color
}
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
