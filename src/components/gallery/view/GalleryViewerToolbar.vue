<template>
  <v-divider></v-divider>
  <v-toolbar density="compact" color="grey-darken-4">
    <v-btn icon @click="viewer.prev" :disabled="viewer.position === 0"
      ><v-icon>mdi-chevron-left</v-icon>
      <v-tooltip activator="parent" location="top"> 이전 사진을 봅니다 </v-tooltip>
    </v-btn>
    <v-btn icon @click="viewer.next" :disabled="viewer.position + 1 === viewer.photo?.files.length"
      ><v-icon>mdi-chevron-right</v-icon>
      <v-tooltip activator="parent" location="top"> 다음 사진을 봅니다 </v-tooltip>
    </v-btn>

    <v-spacer></v-spacer>

    <v-chip
      pill
      prepend-icon="mdi-heart"
      @click="gallery.like(postUid)"
      :color="liked ? 'red' : 'surface-variant'"
    >
      {{ postLike }}
      <v-tooltip activator="parent" location="top">이 사진첩에 좋아요 표시하기</v-tooltip>
    </v-chip>
    <v-btn icon @click="viewer.reset"
      ><v-icon>mdi-reload</v-icon>
      <v-tooltip activator="parent" location="top">사진 위치/크기 초기화하기</v-tooltip></v-btn
    >

    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
      <v-menu activator="parent" open-on-hover>
        <v-list density="compact">
          <v-list-item>
            <v-btn
              prepend-icon="mdi-pencil"
              variant="text"
              :disabled="auth.user.uid !== writerUid && !auth.user.admin"
              >이 글 수정하기</v-btn
            >
          </v-list-item>
          <v-list-item>
            <v-btn
              prepend-icon="mdi-trash-can"
              variant="text"
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
import { useAuthStore } from "../../../store/auth"
import { useGalleryStore } from "../../../store/gallery"
import { useViewerStore } from "../../../store/viewer"

const auth = useAuthStore()
const gallery = useGalleryStore()
const viewer = useViewerStore()
const props = defineProps<{
  postLike: number
  postUid: number
  writerUid: number
  liked: boolean
}>()
</script>
