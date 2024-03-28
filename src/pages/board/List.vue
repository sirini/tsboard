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
                <v-list-item v-if="list.posts.length < 1" class="text-center">
                  <v-icon>mdi-alert-circle</v-icon> 게시글이 존재하지 않습니다. 아직 글이 없거나,
                  목록을 볼 수 있는 레벨이 아닙니다.
                </v-list-item>

                <v-list-item
                  class="list_item pa-0"
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
                    <v-chip
                      size="small"
                      color="blue-grey"
                      prepend-icon="mdi-bullhorn-variant-outline"
                      class="mr-2"
                      v-if="post.status === CONTENT_STATUS.NOTICE"
                      >공지</v-chip
                    >

                    <v-chip
                      v-if="list.config.useCategory && post.status === CONTENT_STATUS.NORMAL"
                      size="small"
                      color="blue-grey"
                      class="mr-2"
                      @click="list.loadPostsByCategory(post.category.uid)"
                      >{{ post.category.name }}</v-chip
                    >

                    {{ util.unescape(post.title) }}

                    <v-chip size="small" color="blue-grey" class="ml-2">{{
                      util.num(post.reply)
                    }}</v-chip>
                  </v-list-item-title>

                  <template v-slot:append>
                    <user-nametag
                      v-if="home.cols < TSBOARD.SCREEN.MOBILE.COLS"
                      :uid="post.writer.uid"
                      :name="post.writer.name"
                      :profile="post.writer.profile"
                    ></user-nametag>

                    <span class="col no text-center"
                      ><v-icon size="small">mdi-eye-outline</v-icon> {{ util.num(post.hit) }}</span
                    >
                    <v-divider vertical v-if="home.cols < TSBOARD.SCREEN.MOBILE.COLS"></v-divider>
                    <span
                      class="col date text-center"
                      v-if="home.cols < TSBOARD.SCREEN.MOBILE.COLS"
                      >{{ util.date(post.submitted) }}</span
                    >
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
            <board-list-paging></board-list-paging>
          </v-card>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
    <user-info-dialog></user-info-dialog>
    <send-report-dialog></send-report-dialog>
    <manage-user-dialog></manage-user-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useBoardListStore } from "../../store/board/list"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardListPaging from "../../components/board/list/BoardListPaging.vue"
import UserNametag from "../../components/user/UserNametag.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import SideDrawer from "../home/SideDrawer.vue"
import { CONTENT_STATUS } from "../../interface/board"
import { TSBOARD } from "../../../tsboard.config"

const list = useBoardListStore()
const util = useUtilStore()
const home = useHomeStore()

onMounted(() => list.loadPostList())
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
  .list_item {
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
