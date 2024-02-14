<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <side-drawer></side-drawer>
      <v-main>
        <v-container class="wrap">
          <v-card elevation="0" rounded="0" class="mx-auto board" max-width="1000">
            <board-header></board-header>

            <v-card-text class="pa-0">
              <v-list class="pa-0">
                <v-list-item
                  class="list_item pa-0"
                  v-for="(post, index) in list.posts"
                  :key="index"
                >
                  <template v-slot:prepend>
                    <span class="col no text-center"
                      ><v-icon size="small" v-if="post.liked" color="red">mdi-heart</v-icon
                      ><v-icon size="small" v-else>mdi-heart-outline</v-icon> {{ post.like }}</span
                    >
                    <v-divider vertical></v-divider>
                    <span class="col cat text-center">{{ post.category.name }}</span>
                    <v-divider vertical></v-divider>
                  </template>
                  <v-list-item-title
                    class="pointer ml-3"
                    @click="util.go('boardView', list.id, post.uid)"
                    >{{ post.title }}
                    <v-icon size="small" color="grey">mdi-image-outline</v-icon>
                    <v-chip class="ml-2" size="small" color="blue">{{ post.reply }}</v-chip>
                  </v-list-item-title>
                  <template v-slot:append>
                    <user-nametag
                      :uid="post.writer.uid"
                      :name="post.writer.name"
                      :profile="PREFIX + post.writer.profile"
                      :size="'default'"
                    ></user-nametag>
                    <span class="col view text-center"
                      ><v-icon size="small">mdi-eye-outline</v-icon> {{ post.hit }}</span
                    >
                    <v-divider vertical></v-divider>
                    <span class="col date text-center">{{ post.submitted }}</span>
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

const list = useBoardListStore()
const util = useUtilStore()
const PREFIX = process.env.PREFIX || ""
</script>

<style type="scss" scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.board {
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
      width: 100px;
    }
    .heart {
      width: 50px;
    }
    .date {
      width: 100px;
    }
  }
}
</style>
