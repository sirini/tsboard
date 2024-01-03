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
                <v-list-item class="list_item pa-0" v-for="(post, index) in posts" :key="index">
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
                    @click="util.go('boardView', board.id, post.uid)"
                    >{{ post.subject }}
                    <v-icon size="small" color="grey">mdi-image-outline</v-icon>
                    <v-chip class="ml-2" size="small" color="blue">{{ post.reply }}</v-chip>
                  </v-list-item-title>
                  <template v-slot:append>
                    <user-nametag
                      :uid="post.writer.uid"
                      :name="post.writer.name"
                      :profile="post.writer.profile"
                      :size="'default'"
                    ></user-nametag>
                    <span class="col view text-center"
                      ><v-icon size="small">mdi-eye-outline</v-icon> {{ post.view }}</span
                    >
                    <v-divider vertical></v-divider>
                    <span class="col date text-center">{{ post.date }}</span>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>

            <v-card-actions>
              <v-btn prepend-icon="mdi-text-search-variant">
                검색
                <v-menu activator="parent" :close-on-content-click="false">
                  <board-list-search></board-list-search>
                </v-menu>
              </v-btn>
              <v-spacer></v-spacer>
              <v-pagination :length="5"></v-pagination>
              <v-spacer></v-spacer>
              <v-btn
                prepend-icon="mdi-pencil"
                variant="text"
                @click="util.go('boardWrite', board.id)"
                >새글쓰기</v-btn
              >
            </v-card-actions>
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
import { ref, onMounted } from "vue"
import { useAuthStore } from "../../store/auth"
import { useBoardStore } from "../../store/board"
import { useUtilStore } from "../../store/util"
import { useHomeStore } from "../../store/home"
import { Post } from "../../interface/board"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardListSearch from "../../components/board/list/BoardListSearch.vue"
import UserNametag from "../../components/user/UserNametag.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import SendNoteDialog from "../../components/user/SendNoteDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import SideDrawer from "../home/SideDrawer.vue"

const auth = useAuthStore()
const board = useBoardStore()
const util = useUtilStore()
const home = useHomeStore()
const PREFIX = process.env.PREFIX || ""

onMounted(() => {
  home.color = "blue-grey-lighten-5"
  home.footerColor = "blue-grey-lighten-5"
})

const posts = ref<Post[]>([
  {
    uid: 1,
    category: {
      uid: 6,
      name: "news",
    },
    writer: {
      uid: 11,
      name: "홍길동",
      profile: "/no-profile.png",
    },
    subject: "글 제목이 나타납니다",
    content: "",
    like: 3,
    reply: 2,
    view: 28,
    date: "2023-10-22",
    liked: false,
  },
  {
    uid: 2,
    category: {
      uid: 5,
      name: "free",
    },
    writer: {
      uid: 14,
      name: "일지매",
      profile: "/no-profile.png",
    },
    subject:
      "글 제목을 좀 더 길게 적어보도록 하겠습니다. 만약 엄청나게 긴 제목일 경우 잘라서 보여줘야 합니다. 자르는 문제는 추후 생각해 보겠습니다.",
    content: "",
    like: 3,
    reply: 2,
    view: 152,
    date: "2023-10-22",
    liked: true,
  },
  {
    uid: 3,
    category: {
      uid: 5,
      name: "news",
    },
    writer: {
      uid: 14,
      name: "강감찬",
      profile: "/no-profile.png",
    },
    subject: "새로운 게시글 예시.",
    content: "",
    like: 1,
    reply: 5,
    view: 12,
    date: "2023-11-19",
    liked: false,
  },
])
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
