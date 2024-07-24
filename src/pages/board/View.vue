<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <v-card elevation="0" rounded="0" class="mx-auto board" :max-width="view.config.width">
            <board-header :name="view.config.name" :info="view.config.info"></board-header>
            <v-list>
              <v-list-item>
                <v-list-item-title class="view-title">{{
                  util.unescape(view.post.title)
                }}</v-list-item-title>
              </v-list-item>

              <board-view-statistics></board-view-statistics>
              <board-view-attachments></board-view-attachments>
              <board-view-attachment-thumbnail></board-view-attachment-thumbnail>

              <v-list-item class="pa-3 mb-16 tsboard">
                <v-card v-html="view.post.content" elevation="0" rounded="0"></v-card>
              </v-list-item>

              <board-view-tags :tags="view.tags"></board-view-tags>

              <v-list-item class="pa-3 text-caption signature" v-if="view.post.writer.signature">
                {{ util.unescape(view.post.writer.signature) }}
              </v-list-item>

              <board-view-buttons></board-view-buttons>
            </v-list>

            <board-view-comment-write
              v-if="view.post.uid > 0"
              :type="view.config.type"
              :board-uid="view.config.uid"
              :post-uid="view.postUid"
            ></board-view-comment-write>
            <board-view-comment-list v-if="view.post.uid > 0"></board-view-comment-list>
            <board-view-bottom-buttons :type="view.config.type"></board-view-bottom-buttons>
          </v-card>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>

    <board-view-remove-post-dialog></board-view-remove-post-dialog>
    <user-info-dialog></user-info-dialog>
    <send-report-dialog></send-report-dialog>
    <manage-user-dialog></manage-user-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useBoardViewStore } from "../../store/board/view"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardViewStatistics from "../../components/board/view/BoardViewStatistics.vue"
import BoardViewAttachments from "../../components/board/view/BoardViewAttachments.vue"
import BoardViewAttachmentThumbnail from "../../components/board/view/BoardViewAttachmentThumbnail.vue"
import BoardViewTags from "../../components/board/view/BoardViewTags.vue"
import BoardViewButtons from "../../components/board/view/BoardViewButtons.vue"
import BoardViewCommentWrite from "../../components/board/comment/BoardViewCommentWrite.vue"
import BoardViewCommentList from "../../components/board/comment/BoardViewCommentList.vue"
import BoardViewBottomButtons from "../../components/board/view/BoardViewBottomButtons.vue"
import BoardViewRemovePostDialog from "../../components/board/view/BoardViewRemovePostDialog.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import SideDrawer from "../home/SideDrawer.vue"
import "../../assets/board/editor.scss"

const view = useBoardViewStore()
const util = useUtilStore()
const home = useHomeStore()

onMounted(() => {
  view.loadPostView()
  home.setGridLayout()
})
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.view-title {
  font-weight: bold;
  font-size: 1.2em;
}
.signature {
  color: #90a4ae;
}
</style>
