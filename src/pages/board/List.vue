<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <v-card elevation="0" rounded="0" class="mx-auto board" :width="list.config.width">
            <board-header></board-header>

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

                    <v-divider vertical></v-divider>
                    <span class="col cat text-center">{{ post.category.name }}</span>
                    <v-divider vertical></v-divider>
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
                    {{ post.title }}
                    <v-icon size="small" color="grey">mdi-image-outline</v-icon>

                    <v-chip class="ml-2" size="small" color="blue">{{ post.reply }}</v-chip>
                  </v-list-item-title>

                  <template v-slot:append>
                    <user-nametag
                      :uid="post.writer.uid"
                      :name="post.writer.name"
                      :profile="post.writer.profile"
                    ></user-nametag>

                    <span class="col view text-center"
                      ><v-icon size="small">mdi-eye-outline</v-icon> {{ util.num(post.hit) }}</span
                    >
                    <v-divider vertical></v-divider>
                    <span class="col date text-center">{{ util.date(post.submitted) }}</span>
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
    <send-note-dialog></send-note-dialog>
    <send-report-dialog></send-report-dialog>
    <manage-user-dialog></manage-user-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue"
import { useBoardListStore } from "../../store/board/list"
import { useUtilStore } from "../../store/util"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardListPaging from "../../components/board/list/BoardListPaging.vue"
import UserNametag from "../../components/user/UserNametag.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import SendNoteDialog from "../../components/user/SendNoteDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import SideDrawer from "../home/SideDrawer.vue"
import { CONTENT_STATUS } from "../../interface/board"

const list = useBoardListStore()
const util = useUtilStore()

onMounted(() => list.loadPostList())
watch(
  () => [list.page, list.id],
  () => list.loadPostList(),
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
      width: 70px;
    }
    .cat {
      width: 100px;
    }
    .view {
      width: 80px;
    }
    .heart {
      width: 50px;
    }
    .date {
      width: 80px;
    }
  }
}
</style>
