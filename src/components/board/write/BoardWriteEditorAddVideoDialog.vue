<template>
  <v-dialog width="500" v-model="board.addVideoURLDialog" persistent>
    <v-card>
      <v-card-title>YouTube URL 추가</v-card-title>
      <v-divider></v-divider>
      <v-alert
        v-model="alert"
        type="error"
        closable
        class="ma-3"
        title="올바른 URL 형식이 아닙니다. 입력하신 URL을 다시 확인해 주세요."
      >
      </v-alert>
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
        <v-btn prepend-icon="mdi-close" @click="board.addVideoURLDialog = false">닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="add" append-icon="mdi-chevron-right">본문에 추가하기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useBoardStore } from "../../../store/board"
import { VideoURL } from "../../../interface/board"

const board = useBoardStore()
const emits = defineEmits<{
  addVideoURL: [video: VideoURL]
}>()
const link = ref<string>("https://")
const width = ref<number>(640)
const height = ref<number>(480)
const alert = ref<boolean>(false)
const urlPattern = /(https:\/\/)(www\.)?(youtu(be)?)\.(be|com)?\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/
const urlRule = [
  (value: string) => {
    return urlPattern.test(value) === true || "올바른 YouTube URL 형식이 아닙니다."
  },
]
const sizeRule = [
  (value: number) => {
    return (value > 10 && value < 8096) || "잘못된 크기 지정입니다."
  },
]

// 외부 이미지 추가 반영하기
function add(): void {
  if (urlPattern.test(link.value) === false) {
    alert.value = true
    return
  }
  alert.value = false
  emits("addVideoURL", { src: link.value, width: width.value, height: height.value })
}
</script>
