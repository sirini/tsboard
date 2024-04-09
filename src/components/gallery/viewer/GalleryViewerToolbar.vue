<template>
  <v-toolbar density="compact" :color="color ? color : ''">
    <v-btn icon @click="viewer.prev" :disabled="viewer.position === 0">
      <v-icon>mdi-chevron-left</v-icon>
      <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].PREV_TOOLTIP }}</v-tooltip>
    </v-btn>

    <v-btn icon @click="viewer.next" :disabled="viewer.position + 1 === viewer.files.length">
      <v-icon>mdi-chevron-right</v-icon>
      <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].NEXT_TOOLTIP }}</v-tooltip>
    </v-btn>

    <v-btn
      icon
      @click="viewer.isViewContent = !viewer.isViewContent"
      v-if="home.cols > TSBOARD.SCREEN.TABLET.COLS"
    >
      <v-icon>mdi-swap-horizontal</v-icon>
      <v-tooltip activator="parent">{{
        viewer.isViewContent ? TEXT[home.lang].VIEW_PHOTO : TEXT[home.lang].VIEW_CONTENT
      }}</v-tooltip></v-btn
    >

    <v-chip
      pill
      prepend-icon="mdi-heart"
      @click="viewer.like(!viewer.post.liked)"
      :color="liked ? 'red' : ''"
    >
      {{ postLike }}
      <v-tooltip activator="parent" location="top">{{ TEXT[home.lang].LIKE_TOOLTIP }}</v-tooltip>
    </v-chip>

    <v-spacer></v-spacer>

    <v-btn icon @click="isOpenMenu = !isOpenMenu">
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

    <v-btn icon @click="viewer.close"
      ><v-icon>mdi-close</v-icon>
      <v-tooltip activator="parent">{{ TEXT[home.lang].CLOSE_TOOLTIP }}</v-tooltip>
    </v-btn>
  </v-toolbar>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useViewerStore } from "../../../store/board/gallery/viewer"
import { useBoardViewStore } from "../../../store/board/view"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"
import { useHomeStore } from "../../../store/home"
import { TEXT } from "../../../messages/components/gallery/viewer/gallery-viewer"
import { TSBOARD } from "../../../../tsboard.config"

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
  color?: string
}>()
const isOpenMenu = ref<boolean>(false)

// 사진 삭제하기
function remove(): void {
  view.postUid = viewer.postUid
  viewer.dialog = false
  view.openConfirmRemoveDialog()
}
</script>
