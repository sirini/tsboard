<template>
  <v-card elevation="0" rounded="0">
    <v-list>
      <v-list-subheader>글 전체 검색</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item class="mt-3 mb-3">
        <template v-slot:prepend>
          <v-btn-toggle v-model="latest.option" mandatory class="mt-1">
            <v-btn value="title">제목</v-btn>
            <v-btn value="content">내용</v-btn>
          </v-btn-toggle>
        </template>

        <v-text-field
          variant="outlined"
          v-model="latest.keyword"
          hide-details
          class="ml-5 mt-1 mr-1"
          prepend-inner-icon="mdi-restore"
          append-inner-icon="mdi-magnify"
          @keyup="latest.updateLatestPosts"
          @click:prepend-inner="latest.resetKeyword"
          @click:append-inner="latest.updateLatestPosts"
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

      <v-card variant="text" class="pl-4">
        <v-row align="end">
          <v-col cols="6"
            ><v-checkbox
              v-model="latest.selectAll"
              label="전체 선택하기"
              hide-details
              @click="latest.selectAllPosts"
            ></v-checkbox
          ></v-col>
          <v-col cols="6" class="text-right"
            ><v-btn
              prepend-icon="mdi-trash-can"
              variant="text"
              class="mb-2"
              color="red"
              :disabled="latest.selected.length < 1"
              @click="latest.removePosts"
              >선택 삭제하기
              <v-tooltip activator="parent"
                >삭제한 게시글은 다시 되살릴 수 없습니다. 정말로 삭제하고자 할 경우에만
                클릭해주세요!</v-tooltip
              >
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <v-divider></v-divider>
      <v-list-item v-for="(post, index) in latest.posts" :key="index" class="underline">
        <template v-slot:prepend>
          <v-checkbox
            v-model="latest.selected"
            :value="post.uid"
            hide-details
            class="selected"
          ></v-checkbox>

          <user-nametag
            :uid="post.writer.uid"
            :name="post.writer.name"
            :profile="post.writer.profile"
          ></user-nametag>
        </template>

        <v-list-item-title @click="util.go(post.type, post.id, post.uid)" class="title"
          ><span class="ml-3" :class="post.status < 0 ? 'removed' : ''">{{ post.title }}</span>
        </v-list-item-title>

        <template v-slot:append>
          <v-chip
            size="small"
            :color="COLOR.HOME.HEADER"
            prepend-icon="mdi-comment-outline"
            class="ml-2 mr-1"
            variant="text"
            >{{ post.comment }}</v-chip
          >
          <v-chip size="small" :color="COLOR.HOME.HEADER" variant="text">{{
            util.date(post.date)
          }}</v-chip>
        </template>
        <v-tooltip activator="parent">클릭하시면 게시글을 보러 갑니다.</v-tooltip>
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
import { useAdminLatestPostStore } from "../../../store/admin/latest/post"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"
import ChatDialog from "../../user/ChatDialog.vue"
import ManageUserDialog from "../../user/ManageUserDialog.vue"
import SendReportDialog from "../../user/SendReportDialog.vue"
import UserInfoDialog from "../../user/UserInfoDialog.vue"
import UserNametag from "../../user/UserNametag.vue"
import Paging from "../common/AdminBottomPaging.vue"

const latest = useAdminLatestPostStore()
const util = useUtilStore()
const home = useHomeStore()

onMounted(() => latest.loadLatestPosts())
watch(
  () => [latest.page, latest.bunch],
  () => latest.loadLatestPosts(),
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
