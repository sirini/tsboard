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
                <v-list-item-title class="view_title">{{
                  util.unescape(view.post.title)
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item class="view_info underline">
                <template v-slot:prepend>
                  <span class="mr-4 text-caption" v-if="view.config.useCategory"
                    ><v-icon size="small" class="mr-2">mdi-filter-outline</v-icon>
                    {{ view.post.category.name }}</span
                  >
                  <v-divider vertical v-if="view.config.useCategory" class="mr-4"></v-divider>

                  <span class="mr-4 text-caption"
                    >작성: {{ util.date(view.post.submitted, true, true) }}</span
                  >

                  <v-divider vertical v-if="view.post.modified > 0"></v-divider>
                  <span class="ml-4 mr-4 text-caption" v-if="view.post.modified > 0"
                    >수정: {{ util.date(view.post.modified, true, true) }}</span
                  >
                </template>

                <template v-slot:append>
                  <span class="mr-4 text-caption"
                    ><v-icon size="small" class="mr-2">mdi-eye-outline</v-icon>
                    {{ util.num(view.post.hit) }}</span
                  >
                  <v-divider vertical></v-divider>
                  <span class="ml-4 text-caption"
                    ><v-icon size="small" class="mr-2">mdi-comment-outline</v-icon>
                    {{ view.post.reply }}</span
                  >
                </template>
              </v-list-item>

              <v-list-item class="pa-0 underline" v-if="view.files.length > 0">
                <v-list density="compact">
                  <v-list-item
                    prepend-icon="mdi-download"
                    v-for="(file, index) in view.files"
                    :key="index"
                    @click="view.download(file.uid)"
                    >{{ file.name }} ({{ util.num(file.size) }}B)</v-list-item
                  >
                </v-list>
              </v-list-item>

              <v-list-item class="pa-3 mb-16 tsboard">
                <v-card v-html="view.post.content" elevation="0" rounded="0"></v-card>
              </v-list-item>

              <v-list-item class="pa-3">
                <v-chip
                  label
                  prepend-icon="mdi-tag-outline"
                  class="mr-2 mb-2"
                  v-for="(tag, index) in view.tags"
                  :key="index"
                  >{{ tag.name }}</v-chip
                >
              </v-list-item>

              <v-list-item class="pa-3 text-caption signature" v-if="view.post.writer.signature">
                {{ util.unescape(view.post.writer.signature) }}
              </v-list-item>

              <v-list-item density="compact" class="pa-0 mt-6 mb-3">
                <template v-slot:prepend>
                  <v-chip
                    class="mr-2"
                    :disabled="auth.user.uid < 1"
                    :prepend-icon="view.post.liked ? 'mdi-heart' : 'mdi-heart-outline'"
                    :color="view.post.liked ? 'red' : 'blue-grey'"
                    @click="view.like(!view.post.liked)"
                  >
                    {{ util.num(view.post.like) }}
                    <v-tooltip activator="parent">이 글에 좋아요 누르기</v-tooltip>
                  </v-chip>

                  <user-nametag
                    :profile="view.post.writer.profile"
                    :uid="view.post.writer.uid"
                    :name="view.post.writer.name"
                    :size="'default'"
                  ></user-nametag>
                </template>

                <template v-slot:append>
                  <v-btn
                    prepend-icon="mdi-pencil"
                    variant="text"
                    @click="util.go('boardModify', view.id, view.postUid)"
                    :disabled="auth.user.uid !== view.post.writer.uid && !auth.user.admin"
                    >수정</v-btn
                  >
                  <v-btn
                    prepend-icon="mdi-trash-can"
                    variant="text"
                    @click="view.openConfirmRemoveDialog"
                    :disabled="auth.user.uid !== view.post.writer.uid && !auth.user.admin"
                    >삭제
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>

            <board-view-comment-write></board-view-comment-write>
            <board-view-comment-list></board-view-comment-list>

            <v-divider class="mt-12"></v-divider>
            <v-card-actions>
              <v-btn prepend-icon="mdi-view-list" @click="util.go('boardList', view.id)"
                >목록 보기</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                prepend-icon="mdi-pencil"
                variant="text"
                @click="util.go('boardWrite', view.id)"
                >새글쓰기</v-btn
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
import { useUtilStore } from "../../store/util"
import BoardHeader from "../../components/board/common/BoardHeader.vue"
import BoardViewCommentWrite from "../../components/board/comment/BoardViewCommentWrite.vue"
import BoardViewCommentList from "../../components/board/comment/BoardViewCommentList.vue"
import BoardViewRemovePostDialog from "../../components/board/view/BoardViewRemovePostDialog.vue"
import UserNametag from "../../components/user/UserNametag.vue"
import UserInfoDialog from "../../components/user/UserInfoDialog.vue"
import ChatDialog from "../../components/user/ChatDialog.vue"
import SendReportDialog from "../../components/user/SendReportDialog.vue"
import ManageUserDialog from "../../components/user/ManageUserDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import SideDrawer from "../home/SideDrawer.vue"
import "../../assets/board/editor.scss"

const auth = useAuthStore()
const view = useBoardViewStore()
const util = useUtilStore()

onMounted(() => view.loadPostView())
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.view_title {
  font-weight: bold;
  font-size: 1.2em;
}
.underline {
  border-bottom: 1px #dddddd solid;
}
.view_info {
  color: #828282;
  font-size: 0.85em;
}
.signature {
  color: #90a4ae;
}
</style>
