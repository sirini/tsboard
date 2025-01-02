<template>
  <v-dialog v-model="image.uploadImageDialog" persistent>
    <v-card
      :max-width="home.dialogWidth"
      class="mx-auto"
      :color="COLOR.HOME.MAIN"
      :loading="image.uploading"
      rounded="xl"
    >
      <v-card-title>{{ TEXT[home.lang].TITLE_INSERT_IMAGE_UPLOAD }}</v-card-title>
      <v-divider></v-divider>
      <v-list class="pl-2 pr-2"><alert-bar></alert-bar></v-list>

      <v-card-text>
        <v-card variant="tonal" class="mt-2 mb-5">
          <v-card-text class="pa-3"> {{ TEXT[home.lang].INFO_INSERT_IMAGE_UPLOAD }}</v-card-text>
        </v-card>
        <v-file-input
          @change="image.uploadImageFiles"
          class="mb-3"
          show-size
          counter
          :rules="image.uploadRule"
          accept="image/*"
          prepend-icon="mdi-image-search-outline"
          multiple
          variant="solo"
          rounded="pill"
          :label="TEXT[home.lang].SELECT_IMAGES"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="fileName in fileNames" :key="fileName">
              <v-chip
                size="x-small"
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
          <v-col v-for="(img, index) in image.uploadedImages" :key="index" cols="3">
            <v-card elevation="0" rounded="lg">
              <v-img cover height="100" aspect-ratio="1/1" :src="TSBOARD.PREFIX + img"></v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="close" :disabled="image.uploading" rounded="pill">{{
          TEXT[home.lang].CLOSE
        }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="add" :disabled="image.uploading" rounded="pill"
          >{{ TEXT[home.lang].UPLOAD_AND_INSERT }}
          <v-icon class="ml-2">mdi-chevron-right</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch } from "vue"
import { COLOR, TSBOARD } from "../../../../tsboard.config"
import { TEXT } from "../../../messages/components/board/write/board-write-editor-others"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useEditorImageStore } from "../../../store/board/image"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"
import AlertBar from "../../util/AlertBar.vue"

const util = useUtilStore()
const home = useHomeStore()
const editor = useBoardEditorStore()
const image = useEditorImageStore()
const emits = defineEmits<{
  addImageURL: [src: string]
}>()

// 선택한 이미지 파일들을 읽어오기
watch(
  () => image.files,
  (value: File[]) => {
    for (const v of value) {
      const src = URL.createObjectURL(v)
      image.uploadingImages.push(src)
    }
    image.boardUid = editor.config.uid
  },
)

// 업로드한 이미지들 본문에 추가하기
function add(): void {
  for (const src of image.uploadedImages) {
    emits("addImageURL", src)
  }
  image.uploadingImages = []
}

// 업로드하기 다이얼로그 닫기
function close(): void {
  image.uploadingImages = []
  image.uploadedImages = []
  image.uploadImageDialog = false
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
