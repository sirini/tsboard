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

              <v-list-item class="pa-6" v-if="view.thumbs.length > 0">
                <v-row>
                  <v-col cols="3" v-for="(thumb, index) in view.thumbs" :key="index">
                    <v-img cover :src="thumb"></v-img>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-divider v-if="view.thumbs.length > 0"></v-divider>

              <v-list-item class="pa-3 mb-16 tsboard">
                <v-card v-html="view.post.content" elevation="0" rounded="0"></v-card>
              </v-list-item>

              <board-view-tags :tags="view.tags"></board-view-tags>

              <v-list-item class="pa-3 text-caption signature" v-if="view.post.writer.signature">
                {{ util.unescape(view.post.writer.signature) }}
              </v-list-item>

              <board-view-buttons></board-view-buttons>
            </v-list>

            <board-view-comment-write></board-view-comment-write>
            <board-view-comment-list></board-view-comment-list>

            <v-divider class="mt-12"></v-divider>
            <v-card-actions>
              <v-btn prepend-icon="mdi-view-list" @click="util.go('boardList', view.id)">{{
                TEXT[home.lang].LIST
              }}</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                prepend-icon="mdi-pencil"
                variant="text"
                @click="util.go('boardWrite', view.id)"
                :disabled="auth.user.uid < 1"
                >{{ TEXT[home.lang].WRITE }}</v-btn
              >
            </v-card-actions>
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
import { useAuthStore } from "../../store/user/auth"
import { useBoardViewStore } from "../../store/board/view"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardViewStatistics from "../../components/board/view/BoardViewStatistics.vue"
import BoardViewAttachments from "../../components/board/view/BoardViewAttachments.vue"
import BoardViewTags from "../../components/board/view/BoardViewTags.vue"
import BoardViewButtons from "../../components/board/view/BoardViewButtons.vue"
import BoardViewCommentWrite from "../../components/board/comment/BoardViewCommentWrite.vue"
import BoardViewCommentList from "../../components/board/comment/BoardViewCommentList.vue"
import BoardViewRemovePostDialog from "../../components/board/view/BoardViewRemovePostDialog.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import SideDrawer from "../home/SideDrawer.vue"
import "../../assets/board/editor.scss"
import { TEXT } from "../../messages/pages/board/view"

const auth = useAuthStore()
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
