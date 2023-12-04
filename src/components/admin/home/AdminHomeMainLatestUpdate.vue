<template>
  <v-row>
    <v-col>
      <v-card class="ml-1 mt-3 mb-3">
        <v-card-title
          >최신 글
          <div class="more">
            <v-btn
              prepend-icon="mdi-magnify"
              rounded="xl"
              elevation="0"
              @click="util.go('adminLatestPost')"
              >더 보기
              <v-tooltip activator="parent"
                >클릭하시면 최신 글들을 모아 둔 관리 화면으로 이동합니다.</v-tooltip
              >
            </v-btn>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-list density="compact">
          <v-list-item
            v-for="(post, index) in latestPosts"
            :key="index"
            @click="util.go('boardView', post.id, post.uid)"
            append-icon="mdi-chevron-right"
          >
            <v-list-item-title>{{ post.subject }}</v-list-item-title>
            <v-tooltip activator="parent">게시글을 확인하러 갑니다.</v-tooltip>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col>
      <v-card class="mt-3 mb-3">
        <v-card-title
          >최신 댓글
          <div class="more">
            <v-btn
              prepend-icon="mdi-magnify"
              rounded="xl"
              elevation="0"
              @click="util.go('adminLatestComment')"
              >더 보기</v-btn
            >
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-list density="compact">
          <v-list-item
            v-for="(post, index) in latestComments"
            :key="index"
            @click="util.go('boardView', post.id, post.uid)"
            append-icon="mdi-chevron-right"
          >
            <v-list-item-title>{{ post.comment }}</v-list-item-title>
            <v-tooltip activator="parent">댓글을 확인하러 갑니다.</v-tooltip>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col>
      <v-card class="mt-3 mb-3 mr-1">
        <v-card-title
          >최근 신고
          <div class="more">
            <v-btn
              prepend-icon="mdi-magnify"
              rounded="xl"
              elevation="0"
              @click="util.go('adminReport')"
              >더 보기</v-btn
            >
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-list density="compact">
          <v-list-item
            v-for="(report, index) in latestReports"
            :key="index"
            @click=""
            append-icon="mdi-chevron-right"
          >
            <v-list-item-title>{{ report.message }}</v-list-item-title>
            <v-tooltip activator="parent">신고 내역을 확인하러 갑니다.</v-tooltip>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useUtilStore } from "../../../store/util"

const util = useUtilStore()
const latestPosts = [
  { id: "freeboard", uid: 1, subject: "최신 글 예시 제목입니다. 조금 길게 작성해 둡니다." },
  { id: "notice", uid: 2, subject: "최신 글 예시 제목입니다. 조금 길게 작성해 둡니다." },
  { id: "test", uid: 3, subject: "최신 글 예시 제목입니다. 조금 길게 작성해 둡니다." },
  { id: "notice", uid: 2, subject: "최신 글 예시 제목입니다. 조금 길게 작성해 둡니다." },
  { id: "test", uid: 3, subject: "최신 글 예시 제목입니다. 조금 길게 작성해 둡니다." },
]
const latestComments = [
  { id: "humor", uid: 4, comment: "최신 댓글 내용입니다. 이것 역시 조금 길게 작성해둡니다." },
  { id: "gallery", uid: 5, comment: "최신 댓글 내용입니다. 이것 역시 조금 길게 작성해둡니다." },
  { id: "news", uid: 6, comment: "최신 댓글 내용입니다. 이것 역시 조금 길게 작성해둡니다." },
  { id: "gallery", uid: 5, comment: "최신 댓글 내용입니다. 이것 역시 조금 길게 작성해둡니다." },
  { id: "news", uid: 6, comment: "최신 댓글 내용입니다. 이것 역시 조금 길게 작성해둡니다." },
]
const latestReports = [
  { uid: 1, message: "광고성 게시글을 계속해서 작성하고 있는 나쁜 사용자라서 신고합니다. " },
  { uid: 2, message: "광고성 게시글을 계속해서 작성하고 있는 나쁜 사용자라서 신고합니다. " },
  { uid: 3, message: "광고성 게시글을 계속해서 작성하고 있는 나쁜 사용자라서 신고합니다. " },
  { uid: 4, message: "광고성 게시글을 계속해서 작성하고 있는 나쁜 사용자라서 신고합니다. " },
  { uid: 5, message: "광고성 게시글을 계속해서 작성하고 있는 나쁜 사용자라서 신고합니다. " },
]
</script>

<style scoped>
.more {
  position: absolute;
  top: 6px;
  right: 5px;
}
</style>
