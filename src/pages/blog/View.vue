<template>
  <v-app theme="dark">
    <blog-header :name="view.config.name" :info="view.config.info" :id="view.id"></blog-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <v-card class="mx-auto pa-3" :max-width="view.config.width">
            <v-card-title class="title"
              ><h1>{{ util.unescape(view.post.title) }}</h1></v-card-title
            >
            <v-card-actions class="pa-0">
              <v-chip
                size="large"
                :append-icon="showDownloadList ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                variant="text"
                v-if="view.files.length > 0"
                @click="showDownloadList = !showDownloadList"
                >DOWNLOAD</v-chip
              >

              <v-spacer></v-spacer>

              <v-chip prepend-icon="mdi-eye-outline" color="grey-darken-2" variant="text">{{
                util.num(view.post.hit)
              }}</v-chip>

              <v-chip prepend-icon="mdi-calendar-outline" color="grey-darken-2" variant="text">{{
                util.date(view.post.submitted)
              }}</v-chip>

              <v-chip
                prepend-icon="mdi-pencil-outline"
                color="grey-darken-2"
                variant="text"
                v-if="view.post.modified"
                >{{ util.date(view.post.modified) }}</v-chip
              >
            </v-card-actions>

            <board-view-attachments v-if="showDownloadList"></board-view-attachments>

            <v-carousel
              v-if="view.images.length > 0"
              :continuous="false"
              :show-arrows="view.images.length > 1"
              delimiter-icon="mdi-square-small"
              hide-delimiter-background
              hide-delimiters
            >
              <v-carousel-item
                v-for="(image, i) in view.images"
                :key="i"
                :src="TSBOARD.PREFIX + image.thumbnail.large"
                cover
                class="caro"
              >
                <div class="desc">{{ image.description }}</div>
              </v-carousel-item>
            </v-carousel>

            <v-divider></v-divider>

            <div class="tsboard">
              <v-card v-html="view.post.content" elevation="0" rounded="0"></v-card>
            </div>

            <board-view-tags :tags="view.tags"></board-view-tags>

            <div class="pa-3 text-caption signature" v-if="view.post.writer.signature">
              {{ util.unescape(view.post.writer.signature) }}
            </div>

            <board-view-buttons bg-color="#121212" board-type="blog"></board-view-buttons>

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
        <blog-footer></blog-footer>
      </v-main>
    </v-layout>
    <user-info-dialog></user-info-dialog>
    <send-report-dialog></send-report-dialog>
    <manage-user-dialog></manage-user-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { TSBOARD } from "../../../tsboard.config"
import "../../assets/board/editor.scss"
import BlogFooter from "../../components/blog/BlogFooter.vue"
import BlogHeader from "../../components/blog/BlogHeader.vue"
import BoardViewCommentList from "../../components/board/comment/BoardViewCommentList.vue"
import BoardViewCommentWrite from "../../components/board/comment/BoardViewCommentWrite.vue"
import BoardViewAttachments from "../../components/board/view/BoardViewAttachments.vue"
import BoardViewBottomButtons from "../../components/board/view/BoardViewBottomButtons.vue"
import BoardViewButtons from "../../components/board/view/BoardViewButtons.vue"
import BoardViewSideNavigation from "../../components/board/view/BoardViewSideNavigation.vue"
import BoardViewTags from "../../components/board/view/BoardViewTags.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import { useBoardViewStore } from "../../store/board/view"
import { useUtilStore } from "../../store/util"
import SideDrawer from "../home/SideDrawer.vue"

const route = useRoute()
const view = useBoardViewStore()
const util = useUtilStore()
const showDownloadList = ref<boolean>(false)

watch(
  () => route.params.no,
  () => view.prepareViewPost(),
)
onMounted(() => view.prepareViewPost())
</script>

<style type="scss" scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 130px);
}
.title {
  white-space: pre-wrap;
}
.signature {
  color: #686868;
}
.caro {
  position: relative;
}
.desc {
  padding: 15px;
  font-size: 0.9em;
  position: absolute;
  bottom: 0px;
  backdrop-filter: blur(5px);
}
</style>
