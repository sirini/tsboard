<template>
  <v-card elevation="0" rounded="0">
    <v-list>
      <v-list-subheader>댓글 전체 검색</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item class="mt-3 mb-3">
        <template v-slot:prepend>
          <v-btn-toggle
            v-model="latest.option"
            mandatory
            class="mt-1"
            rounded="pill"
            :color="COLOR.ADMIN.MAIN"
          >
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
          rounded="pill"
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
            class="mt-1 ml-2"
            rounded="pill"
            :items="[5, 10, 15, 20, 25, 30, 40, 50, 100]"
          ></v-select>
        </template>
      </v-list-item>

      <v-card variant="text" class="pl-4">
        <v-row align="end">
          <v-col cols="6"
            ><v-checkbox
              v-model="latest.selectAll"
              label="전체 선택하기"
              hide-details
              @click="latest.selectAllComments"
            ></v-checkbox
          ></v-col>
          <v-col cols="6" class="text-right"
            ><v-btn
              prepend-icon="mdi-trash-can"
              variant="text"
              class="mb-2"
              color="red"
              :disabled="latest.selected.length < 1"
              @click="latest.removeComments"
              >선택 삭제하기
              <v-tooltip activator="parent"
                >삭제한 댓글은 다시 되살릴 수 없습니다. 정말로 삭제하고자 할 경우에만
                클릭해주세요!</v-tooltip
              >
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <v-divider></v-divider>
      <v-list-item v-for="(comment, index) in latest.comments" :key="index" class="underline">
        <template v-slot:prepend>
          <v-checkbox
            v-model="latest.selected"
            :value="comment.uid"
            hide-details
            class="selected"
          ></v-checkbox>

          <user-nametag
            :uid="comment.writer.uid"
            :name="comment.writer.name"
            :profile="comment.writer.profile"
          ></user-nametag>
        </template>

        <v-list-item-title @click="util.go(comment.type, comment.id, comment.postUid)" class="title"
          ><div
            class="ml-3 mr-2"
            :class="comment.status < 0 ? 'removed' : ''"
            v-html="comment.content"
          ></div>
        </v-list-item-title>

        <template v-slot:append>
          <v-chip
            size="small"
            :color="COLOR.HOME.MAIN"
            variant="text"
            prepend-icon="mdi-heart-outline"
            >{{ comment.like }}</v-chip
          >
          <v-chip size="small" :color="COLOR.HOME.MAIN" variant="text">{{
            util.date(comment.date)
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
import { onMounted, watch } from "vue"
import { useAdminLatestCommentStore } from "../../../store/admin/latest/comment"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"
import ChatDialog from "../../user/ChatDialog.vue"
import ManageUserDialog from "../../user/ManageUserDialog.vue"
import SendReportDialog from "../../user/SendReportDialog.vue"
import UserInfoDialog from "../../user/UserInfoDialog.vue"
import UserNametag from "../../user/UserNametag.vue"
import Paging from "../common/AdminBottomPaging.vue"
import { COLOR } from "../../../../tsboard.config"

const latest = useAdminLatestCommentStore()
const util = useUtilStore()
const home = useHomeStore()

onMounted(() => latest.loadLatestComments())
watch(
  () => [latest.page, latest.bunch],
  () => latest.loadLatestComments(),
)
</script>

<style scoped>
.title {
  cursor: pointer;
}
.underline {
  border-bottom: #eceff1 1px solid;
}
.removed {
  color: #f44336;
  font-style: italic;
  text-decoration: line-through;
}
</style>
