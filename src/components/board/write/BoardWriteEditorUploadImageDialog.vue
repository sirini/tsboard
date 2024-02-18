<template>
  <v-dialog v-model="editor.uploadImageDialog" persistent>
    <v-card width="500" class="mx-auto" :color="home.color.header">
      <v-card-title>본문 삽입용 이미지 업로드</v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <alert-bar></alert-bar>
        <v-card variant="tonal" class="mt-2 mb-5">
          <v-card-text class="pa-3">
            본문에 이미지를 추가하기 위한 업로드는 가로폭이
            <strong>{{ editor.config.width }}px</strong> 보다 클 경우 자동으로 줄여서 저장됩니다.
            원본 크기로 첨부가 필요할 경우 파일 첨부 기능을 이용하세요!</v-card-text
          >
        </v-card>
        <v-file-input
          @change="editor.uploadImageFiles"
          class="mb-3"
          show-size
          counter
          :rules="editor.uploadRule"
          accept="image/*"
          prepend-icon="mdi-image-search-outline"
          multiple
          variant="solo"
          label="본문에 추가할 이미지 파일들을 선택해 주세요"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="fileName in fileNames" :key="fileName">
              <v-chip
                size="small"
                label
                color="primary"
                prepend-icon="mdi-image"
                class="mt-1 mr-1 mb-1"
              >
                {{ fileName }}
              </v-chip>
            </template>
          </template>
        </v-file-input>

        <v-row class="mb-1">
          <v-col v-for="(image, index) in uploadImages" :key="index" cols="3">
            <v-card>
              <v-img cover height="100" aspect-ratio="1/1" :src="image"></v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="editor.uploadImageDialog = false">닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="add"
          >위 사진들을 업로드 하고 본문에 추가하기
          <v-icon class="ml-2">mdi-chevron-right</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useUtilStore } from "../../../store/util"
import { useHomeStore } from "../../../store/home"
import AlertBar from "../../util/AlertBar.vue"

const util = useUtilStore()
const home = useHomeStore()
const emits = defineEmits<{
  addImageURL: [src: string]
}>()
const editor = useBoardEditorStore()
const uploadImages = ref<string[]>([])

// 선택한 이미지 파일들을 읽어오기
watch(
  () => editor.files,
  (value: File[]) => {
    for (const v of value) {
      const src = URL.createObjectURL(v)
      uploadImages.value.push(src)
    }
  },
)

// 업로드한 이미지들 본문에 추가하기
function add(): void {
  for (const src of editor.uploadedImages) {
    emits("addImageURL", src)
  }
  util.success("사진을 작성중인 본문에 추가 하였습니다")
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
