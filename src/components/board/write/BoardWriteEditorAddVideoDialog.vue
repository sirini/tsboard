<template>
  <v-dialog v-model="editor.addVideoURLDialog" persistent>
    <v-card width="600" class="mx-auto" rounded="lg" :color="home.color.header">
      <v-card-title>YouTube URL 추가</v-card-title>
      <v-divider></v-divider>

      <alert-bar></alert-bar>
      <v-card-text>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="link"
              variant="solo"
              prepend-inner-icon="mdi-youtube"
              :rules="urlRule"
              @keyup.enter="add"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="width"
              label="비디오 가로(폭) 지정"
              variant="solo"
              prepend-inner-icon="mdi-arrow-expand-horizontal"
              :rules="sizeRule"
            ></v-text-field
          ></v-col>
          <v-col>
            <v-text-field
              v-model="height"
              label="비디오 세로(높이) 지정"
              variant="solo"
              prepend-inner-icon="mdi-arrow-expand-vertical"
              :rules="sizeRule"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="editor.addVideoURLDialog = false">닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="add" append-icon="mdi-chevron-right">본문에 추가하기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"
import { VideoURL } from "../../../interface/editor"
import AlertBar from "../../util/AlertBar.vue"

const editor = useBoardEditorStore()
const home = useHomeStore()
const util = useUtilStore()
const emits = defineEmits<{
  addVideoURL: [video: VideoURL]
}>()
const link = ref<string>("https://")
const width = ref<number>(640)
const height = ref<number>(480)
const urlRule = [
  (value: string) => {
    return util.filters.youtube.test(value) === true || "올바른 YouTube URL 형식이 아닙니다."
  },
]
const sizeRule = [
  (value: number) => {
    return (value > 10 && value < 8096) || "잘못된 크기 지정입니다."
  },
]

// 외부 이미지 추가 반영하기
function add(): void {
  if (util.filters.youtube.test(link.value) === false) {
    util.error("올바른 URL 형식이 아닙니다.")
    return
  }
  emits("addVideoURL", { src: link.value, width: width.value, height: height.value })
}
</script>

<style scoped>
/** 다이얼로그 배경 조정 */
.v-overlay--active {
  animation: tsboardCustomOverlay 0.5s ease-in forwards;
}
@keyframes tsboardCustomOverlay {
  from {
    backdrop-filter: blur(0px);
    background: rgba(0, 0, 0, 0);
  }
  to {
    backdrop-filter: blur(2px);
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
