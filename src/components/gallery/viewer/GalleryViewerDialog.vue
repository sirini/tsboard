<template>
  <v-dialog v-model="viewer.dialog" persistent>
    <v-card :color="home.color.header">
      <v-layout>
        <v-main>
          <v-img
            class="text-center"
            :src="TSBOARD.PREFIX + viewer.files.at(viewer.position)"
            @mousedown="viewer.mouseDown"
            @mousemove="viewer.mouseMove"
            @mouseup="viewer.mouseUp"
            @mousewheel="viewer.mouseWheel"
            @mouseleave="viewer.mouseLeave"
            id="tsboardViewerPreview"
          >
          </v-img>
        </v-main>

        <v-navigation-drawer
          permanent
          nav
          :width="viewer.drawerWidth"
          :location="viewer.drawerPosition"
          :color="home.color.header"
        >
          <v-list>
            <v-list-item class="pb-2">
              {{ util.unescape(viewer.post.title) }}
              <template v-slot:append>
                <v-btn icon @click="viewer.dialog = false" elevation="0" :color="home.color.header"
                  ><v-icon>mdi-close</v-icon>
                  <v-tooltip activator="parent" location="top">
                    클릭하시면 이 창을 닫습니다
                  </v-tooltip>
                </v-btn>
              </template>
            </v-list-item>
            <v-divider></v-divider>

            <v-list-item class="pt-2 pb-2">
              <v-card elevation="0" rounded="0" :color="home.color.header">
                <v-card-text class="pa-0 pt-2 tsboard" v-html="viewer.post.content"></v-card-text>
              </v-card>
            </v-list-item>

            <v-list-item class="pt-2 pb-2">
              <v-row no-gutters>
                <v-col v-for="(file, index) in viewer.files" :key="index" cols="2">
                  <v-img
                    cover
                    height="80"
                    :src="TSBOARD.PREFIX + file"
                    :class="viewer.position === index ? 'selected' : 'deselected'"
                    @click="viewer.position = index"
                  ></v-img>
                </v-col>
              </v-row>
            </v-list-item>

            <v-list-item class="pt-2 pb-2">
              <v-chip
                label
                prepend-icon="mdi-tag-outline"
                class="mr-2 mb-2"
                v-for="(tag, index) in viewer.tags"
                :key="index"
                >{{ tag.name }}</v-chip
              >
            </v-list-item>

            <v-list-item class="pt-2 pb-2 info">
              <v-icon class="mr-2">mdi-calendar</v-icon>
              <span class="submitted">{{ util.date(viewer.post.submitted) }}</span>
              <span v-if="viewer.post.modified > 0" class="modified pl-2 ml-2 mr-2">{{
                util.date(viewer.post.modified)
              }}</span>
              <v-icon class="ml-4 mr-2">mdi-eye-outline</v-icon> {{ util.num(viewer.post.hit) }}

              <template v-slot:append>
                <user-nametag
                  :uid="viewer.post.writer.uid"
                  :name="viewer.post.writer.name"
                  :profile="viewer.post.writer.profile"
                  size="small"
                ></user-nametag>
              </template>
            </v-list-item>

            <gallery-viewer-toolbar
              :postLike="viewer.post.like"
              :postUid="viewer.post.uid"
              :writerUid="viewer.post.writer.uid"
              :liked="viewer.post.liked"
            ></gallery-viewer-toolbar>

            <v-list-item class="pa-0 mt-2 ml-2 mr-2" v-for="(reply, index) in viewer.comments">
              <gallery-viewer-comment
                :commentUid="reply.uid"
                :commentContent="reply.content"
                :commentLike="reply.like"
                :writerProfile="
                  TSBOARD.PREFIX +
                  (reply.writer.profile.length > 0 ? reply.writer.profile : '/no-profile.svg')
                "
                :writerUid="reply.writer.uid"
                :writerName="reply.writer.name"
                :liked="reply.liked"
              ></gallery-viewer-comment>
            </v-list-item>

            <v-list-item class="pa-0 mt-2 ml-2 mr-2">
              <v-textarea
                v-model="comment.content"
                variant="outlined"
                auto-grow
                hide-details
                placeholder="사진이 마음에 드셨다면 댓글을 남겨주세요!"
              ></v-textarea>
            </v-list-item>
          </v-list>

          <board-view-comment-write-button></board-view-comment-write-button>
        </v-navigation-drawer>
      </v-layout>
    </v-card>
  </v-dialog>
  <board-view-comment-remove-dialog></board-view-comment-remove-dialog>
  <user-info-dialog></user-info-dialog>
  <chat-dialog></chat-dialog>
  <send-report-dialog></send-report-dialog>
  <manage-user-dialog></manage-user-dialog>
</template>

<script setup lang="ts">
import { watch } from "vue"
import { useRoute } from "vue-router"
import { useCommentStore } from "../../../store/board/comment"
import { useViewerStore } from "../../../store/board/gallery/viewer"
import { useUtilStore } from "../../../store/util"
import { useHomeStore } from "../../../store/home"
import { TSBOARD } from "../../../../tsboard.config"
import GalleryViewerComment from "./GalleryViewerComment.vue"
import GalleryViewerToolbar from "./GalleryViewerToolbar.vue"
import UserNametag from "../../user/UserNametag.vue"
import UserInfoDialog from "../../user/UserInfoDialog.vue"
import ChatDialog from "../../user/ChatDialog.vue"
import SendReportDialog from "../../user/SendReportDialog.vue"
import ManageUserDialog from "../../user/ManageUserDialog.vue"
import BoardViewCommentRemoveDialog from "../../board/comment/BoardViewCommentRemoveDialog.vue"
import BoardViewCommentWriteButton from "../../board/comment/BoardViewCommentWriteButton.vue"
import "../../../assets/board/editor.scss"

const route = useRoute()
const viewer = useViewerStore()
const util = useUtilStore()
const comment = useCommentStore()
const home = useHomeStore()

// 뷰어 다이얼로그 데이터 준비
function prepare(): void {
  if (route.params?.no) {
    viewer.postUid = parseInt(route.params.no as string)
    viewer.loadPost()
    viewer.loadComments()
  }
}

// 뷰어 창이 열리면 사진들 가져오기
watch(
  () => viewer.dialog,
  (value: boolean) => {
    if (value) {
      prepare()
    }
  },
)
</script>

<style scoped>
.selected {
  opacity: 1;
}
.deselected {
  opacity: 0.2;
}
.info {
  opacity: 0.8;
  font-size: 0.9em;
}
.submitted {
  opacity: 0.6;
}
.modified {
  border-left: #78909c 1px solid;
}
</style>
