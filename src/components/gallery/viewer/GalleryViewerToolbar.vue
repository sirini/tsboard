<template>
  <v-toolbar density="compact">
    <v-chip
      pill
      prepend-icon="mdi-heart"
      @click="viewer.like(!viewer.post.liked)"
      :color="liked ? 'red' : ''"
      class="ml-2 mr-2 pl-4 pr-4"
      size="small"
    >
      {{ postLike }}
      <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].LIKE_TOOLTIP }}</v-tooltip>
    </v-chip>

    <v-btn icon @click="viewer.prev" :disabled="viewer.position === 0" size="small">
      <v-icon>mdi-chevron-left</v-icon>
      <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].PREV_TOOLTIP }}</v-tooltip>
    </v-btn>

    <v-btn
      icon
      @click="viewer.next"
      :disabled="viewer.position + 1 === viewer.images.length"
      size="small"
    >
      <v-icon>mdi-chevron-right</v-icon>
      <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].NEXT_TOOLTIP }}</v-tooltip>
    </v-btn>

    <v-btn
      icon
      @click="viewer.isViewContent = !viewer.isViewContent"
      v-if="home.isMobile"
      size="small"
    >
      <v-icon>mdi-swap-horizontal</v-icon>
      <v-tooltip activator="parent">{{
        viewer.isViewContent ? TEXT[home.lang].VIEW_PHOTO : TEXT[home.lang].VIEW_CONTENT
      }}</v-tooltip></v-btn
    >

    <v-btn
      icon
      @click="view.download(viewer.images[viewer.position].file.uid)"
      :disabled="auth.user.uid < 1"
      size="small"
    >
      <v-icon>mdi-download</v-icon>
      <v-tooltip activator="parent">{{ TEXT[home.lang].DOWNLOAD }}</v-tooltip>
    </v-btn>

    <v-spacer></v-spacer>

    <v-btn icon @click="isOpenMenu = !isOpenMenu" size="small">
      <v-icon>mdi-dots-vertical</v-icon>
      <v-menu v-model="isOpenMenu" activator="parent" open-on-hover>
        <v-list density="compact">
          <v-list-item prepend-icon="mdi-reload" @click="viewer.reset">{{
            TEXT[home.lang].RESET_IMAGE
          }}</v-list-item>

          <v-list-item prepend-icon="mdi-magnify-expand" @click="viewer.zoomIn">{{
            TEXT[home.lang].ZOOMIN
          }}</v-list-item>

          <v-list-item prepend-icon="mdi-arrow-collapse" @click="viewer.zoomOut">{{
            TEXT[home.lang].ZOOMOUT
          }}</v-list-item>

          <v-list-item
            prepend-icon="mdi-pencil"
            @click="util.go('galleryModify', viewer.id, viewer.postUid)"
            :disabled="auth.user.uid !== writerUid && !auth.user.admin"
          >
            {{ TEXT[home.lang].MODIFY }}
          </v-list-item>

          <v-list-item
            prepend-icon="mdi-trash-can"
            @click="remove"
            :disabled="auth.user.uid !== writerUid && !auth.user.admin"
          >
            {{ TEXT[home.lang].REMOVE }}
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-toolbar>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { TEXT } from "../../../messages/components/gallery/viewer/gallery-viewer"
import { useViewerStore } from "../../../store/board/gallery/viewer"
import { useBoardViewStore } from "../../../store/board/view"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"

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
const isOpenMenu = ref<boolean>(false)

// 사진 삭제하기
function remove(): void {
  view.postUid = viewer.postUid
  viewer.dialog = false
  view.openConfirmRemoveDialog()
}
</script>
