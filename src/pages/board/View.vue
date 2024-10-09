<template>
  <v-app class="app">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <v-card class="mx-auto pa-3" :max-width="view.config.width">
            <board-header :name="view.config.name" :info="view.config.info"></board-header>
            <h2 class="view-title pa-3">{{ util.unescape(view.post.title) }}</h2>

            <board-view-statistics></board-view-statistics>
            <board-view-attachments></board-view-attachments>
            <board-view-attachment-thumbnail></board-view-attachment-thumbnail>

            <div class="tsboard">
              <v-card v-html="view.post.content" elevation="0" rounded="0"></v-card>
            </div>

            <board-view-tags :tags="view.tags"></board-view-tags>
            <v-card-text class="text-caption signature" v-if="view.post.writer.signature">
              {{ util.unescape(view.post.writer.signature) }}
            </v-card-text>
            <board-view-writer-post-comment></board-view-writer-post-comment>
            <board-view-buttons></board-view-buttons>
            <board-view-comment-write
              v-if="view.post.uid > 0"
              :type="view.config.type"
              :board-uid="view.config.uid"
              :post-uid="view.postUid"
            ></board-view-comment-write>
            <board-view-comment-list v-if="view.post.uid > 0"></board-view-comment-list>
            <board-view-bottom-buttons :type="view.config.type"></board-view-bottom-buttons>
          </v-card>
          <board-view-side-navigation></board-view-side-navigation>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>

    <board-view-remove-post-dialog></board-view-remove-post-dialog>
    <user-info-dialog></user-info-dialog>
    <send-report-dialog></send-report-dialog>
    <manage-user-dialog></manage-user-dialog>
    <board-view-attachment-thumbnail-view-dialog></board-view-attachment-thumbnail-view-dialog>
    <board-view-move-dialog></board-view-move-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue"
import { useRoute } from "vue-router"
import "../../assets/board/editor.scss"
import BoardViewCommentList from "../../components/board/comment/BoardViewCommentList.vue"
import BoardViewCommentWrite from "../../components/board/comment/BoardViewCommentWrite.vue"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardViewAttachments from "../../components/board/view/BoardViewAttachments.vue"
import BoardViewAttachmentThumbnail from "../../components/board/view/BoardViewAttachmentThumbnail.vue"
import BoardViewAttachmentThumbnailViewDialog from "../../components/board/view/BoardViewAttachmentThumbnailViewDialog.vue"
import BoardViewBottomButtons from "../../components/board/view/BoardViewBottomButtons.vue"
import BoardViewButtons from "../../components/board/view/BoardViewButtons.vue"
import BoardViewMoveDialog from "../../components/board/view/BoardViewMoveDialog.vue"
import BoardViewRemovePostDialog from "../../components/board/view/BoardViewRemovePostDialog.vue"
import BoardViewSideNavigation from "../../components/board/view/BoardViewSideNavigation.vue"
import BoardViewStatistics from "../../components/board/view/BoardViewStatistics.vue"
import BoardViewTags from "../../components/board/view/BoardViewTags.vue"
import BoardViewWriterPostComment from "../../components/board/view/BoardViewWriterPostComment.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import { useBoardViewStore } from "../../store/board/view"
import { useUtilStore } from "../../store/util"
import HomeFooter from "../home/HomeFooter.vue"
import HomeHeader from "../home/HomeHeader.vue"
import SideDrawer from "../home/SideDrawer.vue"

const route = useRoute()
const view = useBoardViewStore()
const util = useUtilStore()

watch(
  () => route.params?.no,
  () => view.prepareViewPost(),
)
onMounted(() => view.prepareViewPost())
onUnmounted(() => {
  window.removeEventListener("scroll", view.updateScrollY)
})
</script>

<style scoped>
.app {
  background-color: #eceff1;
}
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 130px);
}
.view-title {
  font-weight: bold;
  font-size: 1.2em;
  line-height: 1.6em;
}

.signature {
  color: #90a4ae;
}
</style>
