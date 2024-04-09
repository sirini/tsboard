<template>
  <v-dialog v-model="viewer.dialog" persistent>
    <v-card rounded="xl">
      <v-card-text class="pa-0">
        <v-layout>
          <v-main>
            <gallery-viewer-sidebar-mobile-content
              v-if="viewer.isViewContent"
            ></gallery-viewer-sidebar-mobile-content>
            <v-img
              v-else
              class="text-right"
              :src="TSBOARD.PREFIX + viewer.files.at(viewer.position)"
              :height="imageHeight"
              @mousedown="viewer.mouseDown"
              @mousemove="viewer.mouseMove"
              @mouseup="viewer.mouseUp"
              @mousewheel="viewer.mouseWheel"
              @mouseleave="viewer.mouseLeave"
              id="tsboardViewerPreview"
            >
            </v-img>
            <gallery-viewer-toolbar
              :postLike="viewer.post.like"
              :postUid="viewer.post.uid"
              :writerUid="viewer.post.writer.uid"
              :liked="viewer.post.liked"
              :color="viewer.mobileColor"
              v-if="home.cols > TSBOARD.SCREEN.TABLET.COLS"
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
                <v-btn block @click="viewer.close" variant="tonal">{{
                  TEXT[home.lang].CLOSE
                }}</v-btn>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
  <board-view-comment-remove-dialog></board-view-comment-remove-dialog>
  <user-info-dialog></user-info-dialog>
  <chat-dialog></chat-dialog>
  <send-report-dialog></send-report-dialog>
  <manage-user-dialog></manage-user-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useViewerStore } from "../../../store/board/gallery/viewer"
import { useHomeStore } from "../../../store/home"
import { TSBOARD } from "../../../../tsboard.config"
import GalleryViewerSidebar from "./GalleryViewerSidebar.vue"
import GalleryViewerSidebarMobileContent from "./GalleryViewerSidebarMobileContent.vue"
import GalleryViewerToolbar from "./GalleryViewerToolbar.vue"
import UserInfoDialog from "../../user/UserInfoDialog.vue"
import ChatDialog from "../../user/ChatDialog.vue"
import SendReportDialog from "../../user/SendReportDialog.vue"
import ManageUserDialog from "../../user/ManageUserDialog.vue"
import BoardViewCommentRemoveDialog from "../../board/comment/BoardViewCommentRemoveDialog.vue"
import BoardViewCommentWriteButton from "../../board/comment/BoardViewCommentWriteButton.vue"
import "../../../assets/board/editor.scss"
import { TEXT } from "../../../messages/components/gallery/viewer/gallery-viewer"

const route = useRoute()
const viewer = useViewerStore()
const home = useHomeStore()
const imageHeight = ref<number>(500)

// 뷰어 다이얼로그 데이터 준비
function prepare(): void {
  if (route.params?.no) {
    viewer.postUid = parseInt(route.params.no as string)
    viewer.loadPost()
    viewer.loadComments()
    viewer.isViewContent = false
    home.setGridLayout()
  }
}

onMounted(() => {
  imageHeight.value = window.innerHeight - 50
})

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
  animation: tsboardCustomOverlay 1s ease-in forwards;
}
@keyframes tsboardCustomOverlay {
  from {
    backdrop-filter: blur(0px);
    background: rgba(0, 0, 0, 0);
  }
  to {
    backdrop-filter: blur(5px);
    background: rgba(0, 0, 0, 0.8);
  }
}
</style>
