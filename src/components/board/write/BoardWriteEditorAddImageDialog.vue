<template>
  <v-dialog v-model="write.addImageURLDialog" persistent>
    <v-card width="500" class="mx-auto" :color="home.color">
      <v-card-title>외부 이미지 URL 추가</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="dialogBody">
        <alert-bar></alert-bar>
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
        <v-btn prepend-icon="mdi-close" @click="write.addImageURLDialog = false">닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="add" append-icon="mdi-chevron-right">본문에 추가하기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useWriteStore } from "../../../store/write"
import { useUtilStore } from "../../../store/util"
import { useHomeStore } from "../../../store/home"
import AlertBar from "../../util/AlertBar.vue"

const util = useUtilStore()
const home = useHomeStore()
const write = useWriteStore()
const emits = defineEmits<{
  addImageURL: [url: string]
}>()
const link = ref<string>("http://")
const rule = [
  (value: string) => {
    return (
      !value ||
      value.length < 10 ||
      util.filters.url.test(value) === true ||
      "올바른 이미지 URL 형식이 아닙니다."
    )
  },
]

// 외부 이미지 추가 반영하기
function add(): void {
  if (util.filters.url.test(link.value) === false) {
    util.error("올바른 URL 형식이 아닙니다.")
    return
  }
  emits("addImageURL", link.value)
}
</script>

<style scoped>
.dialogBody {
  background-color: white;
}
</style>
