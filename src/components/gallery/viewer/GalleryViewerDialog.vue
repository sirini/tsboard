<template>
  <v-dialog id="tsboardGalleryViewer" v-model="viewer.dialog" theme="dark">
    <v-card rounded="xl">
      <gallery-viewer-dialog-content v-if="viewer.isViewContent"></gallery-viewer-dialog-content>
      <gallery-viewer-dialog-image v-else></gallery-viewer-dialog-image>
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
import "../../../assets/board/editor.scss"
import { useViewerStore } from "../../../store/board/gallery.viewer"
import { useHomeStore } from "../../../store/home"
import BoardViewCommentRemoveDialog from "../../board/comment/BoardViewCommentRemoveDialog.vue"
import ChatDialog from "../../user/ChatDialog.vue"
import ManageUserDialog from "../../user/ManageUserDialog.vue"
import SendReportDialog from "../../user/SendReportDialog.vue"
import UserInfoDialog from "../../user/UserInfoDialog.vue"
import GalleryViewerDialogContent from "./GalleryViewerDialogContent.vue"
import GalleryViewerDialogImage from "./GalleryViewerDialogImage.vue"

const route = useRoute()
const viewer = useViewerStore()
const home = useHomeStore()

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
    background: rgba(0, 0, 0, 0.8);
  }
}
</style>
