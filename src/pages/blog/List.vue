<template>
  <v-app :theme="COLOR.BLOG.THEME">
    <blog-header :name="list.config.name" :info="list.config.info" :id="list.id"></blog-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <v-card elevation="0" rounded="0" class="mx-auto" variant="text" :max-width="home.width">
            <v-row>
              <v-col cols="12" class="text-center mt-9 mb-9">
                <v-avatar size="150">
                  <v-img :src="TSBOARD.PREFIX + (user.info.profile || '/no-profile.svg')"></v-img>
                </v-avatar>

                <h3 class="mt-6">
                  {{ user.info.name }}

                  <v-btn
                    icon
                    size="small"
                    class="ml-2"
                    variant="text"
                    v-if="auth.user.admin"
                    @click="util.go('adminBoardManager', list.id)"
                  >
                    <v-icon>mdi-cog-outline</v-icon>
                    <v-tooltip activator="parent">{{ TEXT[home.lang].MANAGE }}</v-tooltip>
                  </v-btn>

                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    @click="util.open(`${TSBOARD.SITE.URL}${TSBOARD.PREFIX}/goapi/rss/${list.id}`)"
                    ><v-icon>mdi-rss</v-icon>
                    <v-tooltip activator="parent">{{ TEXT[home.lang].RSS }}</v-tooltip>
                  </v-btn>
                </h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col :cols="home.cols" v-for="(post, index) in list.posts" :key="index">
                <blog-post-item
                  :post="post"
                  :type="list.config.type"
                  :useCategory="list.config.useCategory"
                  :id="list.id"
                ></blog-post-item>
              </v-col>
              <v-col v-if="list.posts.length < 1" class="text-center pt-6 pb-12">
                <v-icon>mdi-alert-circle</v-icon> {{ LIST_TEXT[home.lang].EMPTY }}
              </v-col>
            </v-row>

            <board-list-paging></board-list-paging>
          </v-card>
        </v-container>
        <blog-footer></blog-footer>
      </v-main>
      <side-notification-drawer></side-notification-drawer>
    </v-layout>
    <user-info-dialog></user-info-dialog>
    <send-report-dialog></send-report-dialog>
    <manage-user-dialog></manage-user-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useHomeStore } from "../../store/home"
import { useBoardListStore } from "../../store/board/list"
import { useAuthStore } from "../../store/user/auth"
import { useUserStore } from "../../store/user/user"
import { useUtilStore } from "../../store/util"
import SideDrawer from "../home/SideDrawer.vue"
import SideNotificationDrawer from "../home/SideNotificationDrawer.vue"
import BlogHeader from "../../components/blog/BlogHeader.vue"
import BlogFooter from "../../components/blog/BlogFooter.vue"
import BlogPostItem from "../../components/blog/BlogPostItem.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import BoardListPaging from "../../components/board/list/BoardListPaging.vue"
import { COLOR, TSBOARD } from "../../../tsboard.config"
import { TEXT } from "../../messages/components/board/common/board-header"
import { TEXT as LIST_TEXT } from "../../messages/pages/board/list"

const home = useHomeStore()
const list = useBoardListStore()
const auth = useAuthStore()
const user = useUserStore()
const util = useUtilStore()

onMounted(async () => {
  home.setGridLayout()
  await list.loadPostList()
  user.targetUser.uid = list.config.admin.board
  await user.loadUserInfo()
})
</script>

<style type="scss" scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 130px);
}
</style>
