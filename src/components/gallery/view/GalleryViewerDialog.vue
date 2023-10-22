<template>
  <v-dialog v-model="viewer.dialog" persistent>
    <v-card>
      <v-layout>
        <v-main>
          <v-img
            class="text-center"
            :src="PREFIX + viewer.photo?.files.at(viewer.position)"
            @mousedown="viewer.mouseDown"
            @mousemove="viewer.mouseMove"
            @mouseup="viewer.mouseUp"
            @mousewheel="viewer.mouseWheel"
            @mouseleave="viewer.mouseLeave"
            id="tsboardViewerPreview"
          >
          </v-img>
        </v-main>

        <v-navigation-drawer
          permanent
          nav
          :width="viewer.drawerWidth"
          :location="viewer.drawerPosition"
        >
          <v-list>
            <v-list-item class="pb-2">
              {{ viewer.photo?.subject }}
              <template v-slot:append>
                <v-btn icon @click="viewer.dialog = false" elevation="0"
                  ><v-icon>mdi-close</v-icon>
                  <v-tooltip activator="parent" location="top">
                    클릭하시면 이 창을 닫습니다
                  </v-tooltip>
                </v-btn>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="pt-2 pb-2">
              <v-card elevation="0">
                <v-card-text class="pa-0 pt-2 content">{{ viewer.photo?.content }}</v-card-text>
                <v-card-actions class="pa-0">
                  <v-chip
                    label
                    size="small"
                    variant="text"
                    color="grey"
                    prepend-icon="mdi-calendar"
                    >{{ viewer.photo?.date }}</v-chip
                  >
                  <v-spacer></v-spacer>
                  <user-nametag
                    :uid="viewer.photo?.writer.uid || 0"
                    :name="viewer.photo?.writer.name || ''"
                    :profile="viewer.photo?.writer.profile || '/no-profile.png'"
                    size="small"
                  ></user-nametag>
                </v-card-actions>
              </v-card>
            </v-list-item>
            <gallery-viewer-toolbar
              :postLike="viewer.photo?.like || 0"
              :postUid="viewer.photo?.uid || 0"
              :writerUid="viewer.photo?.writer.uid || 0"
            ></gallery-viewer-toolbar>
            <v-list-item class="pa-0 mt-2 ml-2 mr-2" v-for="i in 3" :key="i">
              <gallery-viewer-comment
                :commentUid="i"
                commentContent="댓글 내용"
                :commentLike="i"
                :writerProfile="PREFIX + '/no-profile.png'"
                :writerUid="10"
                writerName="댓작성자"
              ></gallery-viewer-comment>
            </v-list-item>
            <v-list-item class="pa-0 mt-2 ml-2 mr-2">
              <v-textarea
                v-model="comment"
                class="mt-2 mb-1"
                auto-grow
                :rules="viewer.textRule"
                label="사진에 대한 댓글을 입력해 주세요"
              ></v-textarea>
              <v-btn
                block
                size="large"
                variant="tonal"
                color="primary"
                @click="submit"
                append-icon="mdi-chevron-right"
                >댓글 작성하기</v-btn
              >
              <v-btn
                block
                size="large"
                class="mt-2"
                variant="text"
                @click="viewer.dialog = false"
                prepend-icon="mdi-close"
                >닫기</v-btn
              >
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useViewerStore } from "../../../store/viewer"
import { useUtilStore } from "../../../store/util"
import GalleryViewerComment from "./GalleryViewerComment.vue"
import GalleryViewerToolbar from "./GalleryViewerToolbar.vue"
import UserNametag from "../../common/UserNametag.vue"

const PREFIX = process.env.PREFIX || ""
const viewer = useViewerStore()
const util = useUtilStore()
const comment = ref<string>("")

// 뷰어 창이 열리면 사진들 가져오기
watch(
  () => viewer.dialog,
  (value: boolean) => {
    if (value) {
      viewer.load()
    }
  },
)

// 댓글 작성하기
async function submit(): Promise<void> {
  const text = comment.value.trim()
  if (text.length < 3) {
    util.snack("댓글은 3글자 이상 입력해 주세요")
    return
  }
  await viewer.save(text)
  comment.value = ""
}
</script>

<style scoped>
.content {
  font-size: 1em;
}
</style>
