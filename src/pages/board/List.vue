<template>
  <v-app class="app">
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <v-card class="mx-auto board pa-3" :max-width="list.config.width">
            <board-header :name="list.config.name" :info="list.config.info"></board-header>

            <v-card-text class="pa-0">
              <v-list class="pa-0">
                <v-list-item v-if="list.posts.length < 1" class="text-center pa-6">
                  <v-icon>mdi-alert-circle</v-icon> {{ TEXT[home.lang].EMPTY }}
                </v-list-item>

                <v-list-item
                  class="list-item pa-0"
                  v-for="(post, index) in list.posts"
                  :key="index"
                  :lines="home.isMobile ? 'three' : 'one'"
                  :class="post.status === CONTENT_STATUS.NOTICE ? 'notice' : ''"
                >
                  <template v-slot:prepend v-if="home.isMobile === false">
                    <span class="col no text-center">{{ post.uid }}</span>
                  </template>

                  <v-list-item-title
                    class="pointer ml-2 mr-2"
                    @click="util.go('boardView', list.id, post.uid)"
                  >
                    <v-icon
                      size="x-small"
                      color="blue-grey"
                      class="mr-2"
                      v-if="post.status === CONTENT_STATUS.NOTICE"
                      >mdi-bullhorn-variant-outline</v-icon
                    >

                    <span v-if="post.status === CONTENT_STATUS.SECRET">
                      <v-icon
                        size="x-small"
                        color="blue-grey"
                        class="mr-2"
                        v-if="post.writer.uid === auth.user.uid || list.isAdmin === true"
                        >mdi-lock-open-outline</v-icon
                      >
                      <v-icon size="small" color="blue-grey" class="mr-2" v-else>mdi-lock</v-icon>
                    </span>

                    <v-chip
                      v-if="list.config.useCategory && post.status === CONTENT_STATUS.NORMAL"
                      size="x-small"
                      color="blue-grey"
                      class="mr-2"
                      @click="list.loadPostsByCategory(post.category.uid)"
                      >{{ post.category.name }}</v-chip
                    >

                    {{ util.unescape(post.title) }}

                    <span v-if="home.isMobile === false">
                      <v-chip
                        size="x-small"
                        color="blue-grey"
                        class="ml-2"
                        prepend-icon="mdi-chat-outline"
                        variant="text"
                        v-if="post.reply > 0"
                        >{{ util.num(post.reply) }}</v-chip
                      >

                      <v-chip
                        size="x-small"
                        prepend-icon="mdi-heart"
                        color="red"
                        variant="text"
                        v-if="post.liked"
                        >{{ util.num(post.like) }}</v-chip
                      >

                      <v-chip
                        size="x-small"
                        prepend-icon="mdi-heart-outline"
                        color="blue-grey"
                        variant="text"
                        v-else
                        >{{ util.num(post.like) }}</v-chip
                      >
                    </span>
                  </v-list-item-title>

                  <v-list-item-subtitle v-if="home.isMobile" class="text-right mt-2">
                    <v-chip
                      size="x-small"
                      :color="home.color.header"
                      class="ml-2"
                      prepend-icon="mdi-chat-outline"
                      variant="text"
                      v-if="post.reply > 0"
                      >{{ util.num(post.reply) }}</v-chip
                    >

                    <v-chip
                      size="x-small"
                      prepend-icon="mdi-heart"
                      color="red"
                      variant="text"
                      v-if="post.liked"
                      >{{ util.num(post.like) }}</v-chip
                    >

                    <v-chip
                      size="x-small"
                      prepend-icon="mdi-heart-outline"
                      :color="home.color.header"
                      variant="text"
                      v-if="post.liked === false"
                      >{{ util.num(post.like) }}</v-chip
                    >

                    <v-chip
                      size="x-small"
                      prepend-icon="mdi-eye-outline"
                      :color="home.color.header"
                      variant="text"
                      >{{ util.num(post.hit) }}</v-chip
                    >

                    <user-nametag
                      :uid="post.writer.uid"
                      :name="post.writer.name"
                      :profile="post.writer.profile"
                      class="ml-1 mr-1"
                      size="x-small"
                    ></user-nametag>
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <user-nametag
                      v-if="home.isMobile === false"
                      :uid="post.writer.uid"
                      :name="post.writer.name"
                      :profile="post.writer.profile"
                      size="x-small"
                    ></user-nametag>

                    <span class="col no text-center" v-if="home.isMobile === false">{{
                      util.num(post.hit)
                    }}</span>
                    <v-divider vertical v-if="home.isMobile === false"></v-divider>
                    <span class="col date text-center" v-if="home.isMobile === false">{{
                      util.date(post.submitted)
                    }}</span>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
            <board-list-paging></board-list-paging>
          </v-card>
        </v-container>
        <home-footer></home-footer>
        <quick-button v-if="home.isMobile"></quick-button>
      </v-main>
    </v-layout>
    <user-info-dialog></user-info-dialog>
    <send-report-dialog></send-report-dialog>
    <manage-user-dialog></manage-user-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import { CONTENT_STATUS } from "../../../server/database/board/const"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardListPaging from "../../components/board/list/BoardListPaging.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import UserNametag from "../../components/user/UserNametag.vue"
import { TEXT } from "../../messages/pages/board/list"
import { useBoardListStore } from "../../store/board/list"
import { useHomeStore } from "../../store/home"
import { useAuthStore } from "../../store/user/auth"
import { useUtilStore } from "../../store/util"
import HomeFooter from "../home/HomeFooter.vue"
import HomeHeader from "../home/HomeHeader.vue"
import SideDrawer from "../home/SideDrawer.vue"
import QuickButton from "../home/components/mobile/QuickButton.vue"

const route = useRoute()
const list = useBoardListStore()
const util = useUtilStore()
const home = useHomeStore()
const auth = useAuthStore()

onMounted(() => list.initFirstList())

watch(
  () => route.params?.id,
  () => list.resetBoardList(),
)

watch(
  () => route.params?.page,
  (nowPage, prevPage) => {
    list.watchChangingPage(nowPage, prevPage)
  },
)
</script>

<style type="scss" scoped>
.app {
  background-color: #eceff1;
}
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.board {
  .notice {
    background-color: #f9f9f9;
  }
  .list-item {
    border-bottom: 1px #ddd solid;

    .col {
      color: #828282;
      font-size: 0.85em;
    }
    .pointer {
      cursor: pointer;
    }
    .no {
      width: 70px;
    }
    .date {
      width: 80px;
    }
  }
}
</style>
