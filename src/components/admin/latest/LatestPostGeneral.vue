<template>
  <v-card elevation="0" rounded="0">
    <v-list>
      <v-list-subheader>글 전체 검색</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item>
        <v-row>
          <v-col cols="5">
            <v-btn-toggle v-model="latest.option" mandatory class="mt-1">
              <v-btn size="large" value="name">이름</v-btn>
              <v-btn size="large" value="content">내용</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              v-model="latest.search"
              hide-details
              density="compact"
              class="mt-2"
              prepend-inner-icon="mdi-comment-search-outline"
              append-inner-icon="mdi-magnify"
              @click:append-inner=""
            ></v-text-field>
          </v-col>
        </v-row>
      </v-list-item>

      <v-list-subheader>최신 글 모음</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item v-for="(post, index) in latest.posts" :key="index" class="underline">
        <template v-slot:prepend>
          <span class="date mr-3">{{ post.date }}</span>
          <user-nametag
            :uid="post.writer.uid"
            :name="post.writer.name"
            :profile="PREFIX + (post.writer.profile || '/no-profile.svg')"
          ></user-nametag>
        </template>
        <v-list-item-title
          ><span class="ml-3">{{ post.title }}</span>
        </v-list-item-title>
        <template v-slot:append>
          <v-chip
            size="small"
            color="blue-grey"
            prepend-icon="mdi-comment-outline"
            class="ml-2 mr-1"
            >{{ post.comment }}</v-chip
          >
          <v-chip size="small" color="blue-grey" prepend-icon="mdi-heart">{{ post.like }}</v-chip>
          <v-chip size="small" color="blue-grey" class="ml-1" prepend-icon="mdi-eye">{{
            post.hit
          }}</v-chip>
          <v-btn icon elevation="0" @click="util.go('boardView', post.id, post.uid)"
            ><v-icon>mdi-chevron-right</v-icon>
            <v-tooltip activator="parent"> 클릭하시면 이 게시글을 보러 이동 합니다. </v-tooltip>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-pagination :length="5"></v-pagination>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
  <user-info-dialog></user-info-dialog>
  <send-note-dialog></send-note-dialog>
  <send-report-dialog></send-report-dialog>
  <manage-user-dialog></manage-user-dialog>
</template>

<script setup lang="ts">
import { useAdminLatestPostStore } from "../../../store/admin/latest/post"
import { useUtilStore } from "../../../store/util"
import UserNametag from "../../user/UserNametag.vue"
import UserInfoDialog from "../../user/UserInfoDialog.vue"
import SendNoteDialog from "../../user/SendNoteDialog.vue"
import SendReportDialog from "../../user/SendReportDialog.vue"
import ManageUserDialog from "../../user/ManageUserDialog.vue"

const latest = useAdminLatestPostStore()
const util = useUtilStore()
const PREFIX = process.env.PREFIX || ""
</script>

<style scoped>
.date {
  font-size: 0.9em;
  color: #546e7a;
}
.underline {
  border-bottom: #eceff1 1px solid;
}
</style>
