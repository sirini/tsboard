<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <v-card elevation="0" rounded="0" class="mx-auto board" :max-width="list.config.width">
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
                  :class="post.status === CONTENT_STATUS.NOTICE ? 'notice' : ''"
                >
                  <template v-slot:prepend>
                    <span class="col no text-center"
                      ><v-icon size="small" v-if="post.liked" color="red">mdi-heart</v-icon
                      ><v-icon size="small" v-else>mdi-heart-outline</v-icon>
                      {{ util.num(post.like) }}</span
                    >
                  </template>

                  <v-list-item-title
                    class="pointer ml-2 mr-2"
                    @click="util.go('boardView', list.id, post.uid)"
                  >
                    <v-icon
                      size="small"
                      color="blue-grey"
                      class="mr-2"
                      v-if="post.status === CONTENT_STATUS.NOTICE"
                      >mdi-bullhorn-variant-outline</v-icon
                    >

                    <span v-if="post.status === CONTENT_STATUS.SECRET">
                      <v-icon
                        size="small"
                        color="blue-grey"
                        class="mr-2"
                        v-if="post.writer.uid === auth.user.uid || list.isAdmin === true"
                        >mdi-lock-open-outline</v-icon
                      >
                      <v-icon size="small" color="blue-grey" class="mr-2" v-else>mdi-lock</v-icon>
                    </span>

                    <v-chip
                      v-if="list.config.useCategory && post.status === CONTENT_STATUS.NORMAL"
                      size="small"
                      color="blue-grey"
                      class="mr-2"
                      @click="list.loadPostsByCategory(post.category.uid)"
                      >{{ post.category.name }}</v-chip
                    >

                    {{ util.unescape(post.title) }}

                    <v-chip size="small" color="blue-grey" class="ml-2" v-if="post.reply > 0">{{
                      util.num(post.reply)
                    }}</v-chip>
                  </v-list-item-title>

                  <template v-slot:append>
                    <user-nametag
                      v-if="home.isMobile === false"
                      :uid="post.writer.uid"
                      :name="post.writer.name"
                      :profile="post.writer.profile"
                    ></user-nametag>

                    <span class="col no text-center"
                      ><v-icon size="small">mdi-eye-outline</v-icon> {{ util.num(post.hit) }}</span
                    >
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
import { watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useBoardListStore } from "../../store/board/list"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import { useAuthStore } from "../../store/user/auth"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardListPaging from "../../components/board/list/BoardListPaging.vue"
import UserNametag from "../../components/user/UserNametag.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import SideDrawer from "../home/SideDrawer.vue"
import QuickButton from "../home/components/mobile/QuickButton.vue"
import { CONTENT_STATUS } from "../../../server/database/board/const"
import { TEXT } from "../../messages/pages/board/list"

const route = useRoute()
const list = useBoardListStore()
const util = useUtilStore()
const home = useHomeStore()
const auth = useAuthStore()

onMounted(() => list.resetBoardList())

watch(
  () => route.params?.id,
  () => list.resetBoardList(),
)

watch(
  () => route.params?.page,
  () => {
    list.page = parseInt(route.params?.page as string)
    list.resetBoardList()
  },
)
</script>

<style type="scss" scoped>
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
      width: 60px;
    }
    .date {
      width: 80px;
    }
  }
}
</style>
