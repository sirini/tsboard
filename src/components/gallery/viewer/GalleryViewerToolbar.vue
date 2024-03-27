<template>
  <v-toolbar density="compact">
    <v-btn icon @click="viewer.prev" :disabled="viewer.position === 0">
      <v-icon>mdi-chevron-left</v-icon>
      <v-tooltip activator="parent" location="top"> 이전 사진을 봅니다 </v-tooltip>
    </v-btn>
    <v-btn icon @click="viewer.next" :disabled="viewer.position + 1 === viewer.files.length">
      <v-icon>mdi-chevron-right</v-icon>
      <v-tooltip activator="parent" location="top"> 다음 사진을 봅니다 </v-tooltip>
    </v-btn>
    <v-btn icon @click="viewer.reset">
      <v-icon>mdi-reload</v-icon>
      <v-tooltip activator="parent" location="top">사진 위치/크기 초기화하기</v-tooltip>
    </v-btn>

    <v-spacer></v-spacer>

    <v-chip
      pill
      prepend-icon="mdi-heart"
      @click="viewer.like(!viewer.post.liked)"
      :color="liked ? 'red' : ''"
    >
      {{ postLike }}
      <v-tooltip activator="parent" location="top">이 사진첩에 좋아요 표시하기</v-tooltip>
    </v-chip>

    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
      <v-menu activator="parent" open-on-hover>
        <v-list density="compact">
          <v-list-item class="pa-0">
            <v-btn
              prepend-icon="mdi-pencil"
              variant="text"
              @click="util.go('galleryModify', viewer.id, viewer.postUid)"
              :disabled="auth.user.uid !== writerUid && !auth.user.admin"
              >이 글 수정하기</v-btn
            >
          </v-list-item>
          <v-list-item class="pa-0">
            <v-btn
              prepend-icon="mdi-trash-can"
              variant="text"
              @click="remove"
              :disabled="auth.user.uid !== writerUid && !auth.user.admin"
            >
              이 글 삭제하기
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-toolbar>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../store/board/gallery/viewer"
import { useBoardViewStore } from "../../../store/board/view"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"
import { useHomeStore } from "../../../store/home"

const viewer = useViewerStore()
const view = useBoardViewStore()
const util = useUtilStore()
const auth = useAuthStore()
const home = useHomeStore()
const props = defineProps<{
  postLike: number
  postUid: number
  writerUid: number
  liked: boolean
}>()

// 사진 삭제하기
function remove(): void {
  view.postUid = viewer.postUid
  viewer.dialog = false
  view.openConfirmRemoveDialog()
}
</script>
