<template>
  <v-card elevation="0" rounded="0">
    <v-list>
      <v-list-subheader>댓글 전체 검색</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item class="mt-3 mb-3">
        <template v-slot:prepend>
          <v-btn-toggle v-model="latest.option" mandatory class="mt-1">
            <v-btn value="content">내용</v-btn>
          </v-btn-toggle></template
        >

        <v-text-field
          variant="outlined"
          v-model="latest.keyword"
          hide-details
          class="ml-5 mt-1 mr-1"
          prepend-inner-icon="mdi-restore"
          append-inner-icon="mdi-magnify"
          @keyup="latest.updateLatestComments"
          @click:prepend-inner="latest.resetKeyword"
          @click:append-inner="latest.updateLatestComments"
        >
          <v-tooltip activator="parent"
            >검색어를 입력해 보세요.<br />초기 목록을 보려면 왼쪽의 반시계 방향 아이콘을 클릭하세요.
          </v-tooltip>
        </v-text-field>

        <template v-slot:append>
          <v-select
            v-model="latest.bunch"
            variant="outlined"
            hide-details
            class="mt-1"
            :items="[5, 10, 15, 20, 25, 30, 40, 50, 100]"
          ></v-select>
        </template>
      </v-list-item>

      <v-list-subheader>최신 댓글 모음</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item
        v-for="(comment, index) in latest.comments"
        :key="index"
        class="underline"
        @click="util.go(generateBoardType(comment.type as BoardType), comment.id, comment.uid)"
      >
        <template v-slot:prepend>
          <span class="date mr-3">{{ util.date(comment.date) }}</span>
          <user-nametag
            :uid="comment.writer.uid"
            :name="comment.writer.name"
            :profile="comment.writer.profile"
          ></user-nametag>
        </template>
        <v-list-item-title
          ><span class="ml-3 mr-2" :class="comment.status < 0 ? 'removed' : ''">{{
            comment.content
          }}</span>
        </v-list-item-title>
        <v-tooltip activator="parent"> 클릭하시면 이 게시글을 보러 이동 합니다. </v-tooltip>

        <template v-slot:append>
          <v-chip size="small" color="blue-grey" prepend-icon="mdi-heart-outline">{{
            comment.like
          }}</v-chip>
        </template>
      </v-list-item>
    </v-list>
    <paging
      :page="latest.page"
      :page-length="latest.pageLength"
      @prev="latest.page -= 1"
      @next="latest.page += 1"
    ></paging>
  </v-card>
  <user-info-dialog></user-info-dialog>
  <chat-dialog></chat-dialog>
  <send-report-dialog></send-report-dialog>
  <manage-user-dialog></manage-user-dialog>
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue"
import { useAdminLatestCommentStore } from "../../../store/admin/latest/comment"
import { useUtilStore } from "../../../store/util"
import UserNametag from "../../user/UserNametag.vue"
import UserInfoDialog from "../../user/UserInfoDialog.vue"
import ChatDialog from "../../user/ChatDialog.vue"
import SendReportDialog from "../../user/SendReportDialog.vue"
import ManageUserDialog from "../../user/ManageUserDialog.vue"
import Paging from "../common/AdminBottomPaging.vue"
import { BoardType } from "../../../interface/board"
import { BOARD_TYPE } from "../../../../server/database/board/const"

const latest = useAdminLatestCommentStore()
const util = useUtilStore()

onMounted(() => latest.loadLatestComments())
watch(
  () => [latest.page, latest.bunch],
  () => latest.loadLatestComments(),
)

// 게시판 타입에 따라 라우터 이름 변경
function generateBoardType(type: BoardType): string {
  switch (type) {
    case BOARD_TYPE.SHOP as BoardType:
      return "shopView"
    case BOARD_TYPE.GALLERY as BoardType:
      return "galleryOpen"
    case BOARD_TYPE.BLOG as BoardType:
      return "blogRead"
    default:
      return "boardView"
  }
}
</script>

<style scoped>
.date {
  font-size: 0.9em;
  color: #546e7a;
}
.underline {
  border-bottom: #eceff1 1px solid;
}
.removed {
  color: #f44336;
  font-style: italic;
}
</style>
