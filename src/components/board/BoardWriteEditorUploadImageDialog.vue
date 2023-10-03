<template>
  <v-dialog width="500" v-model="board.uploadImageDialog" persistent>
    <v-card>
      <v-card-title>이미지 업로드</v-card-title>
      <v-divider></v-divider>
      <v-alert
        v-model="showAlert"
        :type="alertType"
        closable
        :title="alertText"
        class="ma-3"
      ></v-alert>
      <v-card-text class="mb-3">
        <v-file-input
          @change="readImageFiles"
          class="mb-3"
          show-size
          counter
          :rules="uploadRule"
          accept="image/png, image/jpeg, image/gif, image/bmp, image/heif, image/heic"
          prepend-icon="mdi-camera"
          multiple
          label="여기를 클릭하여 이미지 파일들을 선택해 주세요"
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
        <v-row>
          <v-col v-for="(image, index) in uploadImages" :key="index" cols="3">
            <v-img cover height="100" aspect-ratio="1/1" :src="image"></v-img>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="board.uploadImageDialog = false"><v-icon>mdi-close</v-icon>닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="board.uploadImages" color="primary"
          >업로드 하고 본문에 넣기 <v-icon>mdi-chevron-right</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useBoardStore } from "../../store/board"

const board = useBoardStore()
const uploadRule = [
  (value: any) => {
    return (
      !value ||
      !value.length ||
      value[0].size < 10000000 ||
      "이미지 파일 크기는 10MB 이하여야 합니다."
    )
  },
]

// 선택한 이미지 파일들을 읽어오기
const uploadImages = ref<string[]>([])
function readImageFiles(event: Event): void {
  uploadImages.value = []
  const targets = (event?.target as any).files
  for (const target of targets) {
    const src = URL.createObjectURL(target as File)
    uploadImages.value.push(src)
  }
}

// 알림 내용 지정
const showAlert = ref<boolean>(false)
const alertText = ref<string>("")
const alertType = ref<"error" | "success" | "warning" | "info">("success")
</script>
