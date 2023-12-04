<template>
  <v-card elevation="0">
    <v-list>
      <v-list-subheader>댓글 전체 검색</v-list-subheader>
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

      <v-list-subheader>최신 댓글 모음</v-list-subheader>
      <v-divider></v-divider>
      <v-list-item v-for="(comment, index) in latest.comments" :key="index" class="underline">
        <template v-slot:prepend>
          <span class="date mr-3">{{ comment.date }}</span>
          <user-nametag
            :uid="comment.writer.uid"
            :name="comment.writer.name"
            :profile="PREFIX + (comment.writer.profile || '/no-profile.png')"
          ></user-nametag>
        </template>
        <v-list-item-title
          ><span class="ml-3 mr-2">{{ comment.content }}</span>
          <v-chip size="small" color="blue-grey" prepend-icon="mdi-heart">{{
            comment.like
          }}</v-chip>
        </v-list-item-title>
        <template v-slot:append>
          <v-btn icon elevation="0" @click="util.go('boardView', comment.id, comment.uid)"
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
import { useAdminLatestCommentStore } from "../../../store/admin/latest/comment"
import { useUtilStore } from "../../../store/util"
import UserNametag from "../../user/UserNametag.vue"
import UserInfoDialog from "../../user/UserInfoDialog.vue"
import SendNoteDialog from "../../user/SendNoteDialog.vue"
import SendReportDialog from "../../user/SendReportDialog.vue"
import ManageUserDialog from "../../user/ManageUserDialog.vue"

const latest = useAdminLatestCommentStore()
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
