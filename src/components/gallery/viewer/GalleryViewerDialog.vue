<template>
  <v-dialog v-model="viewer.dialog" persistent>
    <v-card>
      <v-layout>
        <v-main>
          <v-img
            class="text-right"
            :src="TSBOARD.PREFIX + viewer.files.at(viewer.position)"
            @mousedown="viewer.mouseDown"
            @mousemove="viewer.mouseMove"
            @mouseup="viewer.mouseUp"
            @mousewheel="viewer.mouseWheel"
            @mouseleave="viewer.mouseLeave"
            id="tsboardViewerPreview"
          >
            <v-btn
              class="mt-2 mr-2 close"
              icon
              variant="tonal"
              color="white"
              elevation="0"
              size="small"
              v-if="home.cols > TSBOARD.SCREEN.PC.COLS"
              @click="viewer.close"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-img>
          <gallery-viewer-toolbar
            v-if="home.cols > TSBOARD.SCREEN.PC.COLS"
            :postLike="viewer.post.like"
            :postUid="viewer.post.uid"
            :writerUid="viewer.post.writer.uid"
            :liked="viewer.post.liked"
            color="blue-grey"
          ></gallery-viewer-toolbar>
        </v-main>

        <v-navigation-drawer
          permanent
          nav
          :width="viewer.drawerWidth"
          :location="viewer.drawerPosition"
          v-if="home.cols < TSBOARD.SCREEN.TABLET.COLS"
        >
          <gallery-viewer-sidebar></gallery-viewer-sidebar>
          <board-view-comment-write-button></board-view-comment-write-button>

          <v-list>
            <v-list-item class="pa-0 ml-2 mr-2">
              <v-btn block @click="viewer.close" variant="tonal">닫기</v-btn>
            </v-list-item>
          </v-list>
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
import GalleryViewerSidebar from "./GalleryViewerSidebar.vue"
import GalleryViewerToolbar from "./GalleryViewerToolbar.vue"
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
    home.setGridLayout()
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

/** 다이얼로그 배경 조정 */
.v-overlay--active {
  animation: tsboardCustomOverlay 0.5s ease-in forwards;
}
@keyframes tsboardCustomOverlay {
  from {
    backdrop-filter: blur(0px);
    background: rgba(0, 0, 0, 0);
  }
  to {
    backdrop-filter: blur(5px);
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
