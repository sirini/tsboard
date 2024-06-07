<template>
  <v-app theme="dark">
    <blog-header :name="view.config.name" :info="view.config.info" :id="view.id"></blog-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card
            elevation="0"
            rounded="0"
            class="mx-auto"
            variant="text"
            :max-width="view.config.width"
          >
            <v-card-title
              ><h1>{{ util.unescape(view.post.title) }}</h1></v-card-title
            >
            <v-card-actions class="mt-3 mb-3">
              <v-chip
                size="large"
                :append-icon="showDownloadList ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                variant="text"
                v-if="view.files.length > 0"
                @click="showDownloadList = !showDownloadList"
                >DOWNLOAD</v-chip
              >

              <v-spacer></v-spacer>

              <v-chip
                size="large"
                prepend-icon="mdi-eye-outline"
                color="grey-darken-2"
                variant="text"
                >{{ util.num(view.post.hit) }}</v-chip
              >

              <v-chip
                size="large"
                prepend-icon="mdi-calendar-outline"
                color="grey-darken-2"
                variant="text"
                >{{ util.date(view.post.submitted) }}</v-chip
              >

              <v-chip
                size="large"
                prepend-icon="mdi-pencil-outline"
                color="grey-darken-2"
                variant="text"
                v-if="view.post.modified"
                >{{ util.date(view.post.modified) }}</v-chip
              >
            </v-card-actions>

            <board-view-attachments v-if="showDownloadList"></board-view-attachments>

            <v-img :src="view.images[0].thumbnail.large" v-if="view.images.length > 0"></v-img>

            <v-list bg-color="#121212">
              <v-list-item class="mt-6 mb-12 tsboard">
                <v-card
                  v-html="view.post.content"
                  elevation="0"
                  rounded="0"
                  variant="text"
                ></v-card>
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
            ></board-view-comment-write>
            <board-view-comment-list v-if="view.post.uid > 0"></board-view-comment-list>
            <board-view-bottom-buttons :type="view.config.type"></board-view-bottom-buttons>
          </v-card>
        </v-container>
        <blog-footer></blog-footer>
      </v-main>
    </v-layout>
    <user-info-dialog></user-info-dialog>
    <send-report-dialog></send-report-dialog>
    <manage-user-dialog></manage-user-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useBoardViewStore } from "../../store/board/view"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"
import BlogHeader from "../../components/blog/BlogHeader.vue"
import BlogFooter from "../../components/blog/BlogFooter.vue"
import BoardViewAttachments from "../../components/board/view/BoardViewAttachments.vue"
import BoardViewTags from "../../components/board/view/BoardViewTags.vue"
import BoardViewButtons from "../../components/board/view/BoardViewButtons.vue"
import BoardViewCommentWrite from "../../components/board/comment/BoardViewCommentWrite.vue"
import BoardViewCommentList from "../../components/board/comment/BoardViewCommentList.vue"
import BoardViewBottomButtons from "../../components/board/view/BoardViewBottomButtons.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import "../../assets/board/editor.scss"

const view = useBoardViewStore()
const home = useHomeStore()
const util = useUtilStore()
const showDownloadList = ref<boolean>(false)

onMounted(() => {
  view.loadPostView()
  home.setGridLayout()
})
</script>

<style type="scss" scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.signature {
  color: #011d2b;
}
</style>
