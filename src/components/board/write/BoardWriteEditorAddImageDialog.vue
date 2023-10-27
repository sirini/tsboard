<template>
  <v-dialog width="500" v-model="board.addImageURLDialog" persistent>
    <v-card>
      <v-card-title>외부 이미지 URL 추가</v-card-title>
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
        <v-text-field
          v-model="link"
          variant="solo"
          prepend-inner-icon="mdi-web-plus"
          :rules="rule"
          @keyup.enter="add"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="board.addImageURLDialog = false">닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="add" append-icon="mdi-chevron-right">본문에 추가하기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useBoardStore } from "../../../store/board"

const board = useBoardStore()
const emits = defineEmits<{
  addImageURL: [url: string]
}>()
const link = ref<string>("http://")
const alert = ref<boolean>(false)
const urlPattern =
  /(http(s)?:\/\/)(www\.)?[-a-zA-Z0-9@:%._\+\/~#=]{2,256}\.(jpg|jpeg|png|gif)?\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/
const rule = [
  (value: string) => {
    return (
      !value ||
      value.length < 10 ||
      urlPattern.test(value) === true ||
      "올바른 이미지 URL 형식이 아닙니다."
    )
  },
]

// 외부 이미지 추가 반영하기
function add(): void {
  if (urlPattern.test(link.value) === false) {
    alert.value = true
    return
  }
  alert.value = false
  emits("addImageURL", link.value)
}
</script>
