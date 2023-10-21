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
      <v-card-text>
        <v-file-input
          @change="readImageFiles"
          class="mb-3"
          show-size
          counter
          :rules="uploadRule"
          accept="image/png, image/jpeg, image/gif, image/bmp, image/heif, image/heic"
          prepend-icon="mdi-image-search-outline"
          multiple
          variant="solo"
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

        <v-row class="mb-1">
          <v-col v-for="(image, index) in uploadImages" :key="index" cols="3">
            <v-img cover height="100" aspect-ratio="1/1" :src="image"></v-img>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="board.uploadImageDialog = false">닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="add" color="primary"
          >업로드 하고 본문에 넣기 <v-icon>mdi-chevron-right</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useBoardStore } from "../../../store/board"

const emits = defineEmits(["addImageURL"])
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
const uploadImages = ref<string[]>([])

// 업로드한 이미지 파일 예시
const uploadedImages = [
  `https://images.unsplash.com/photo-1688494930045-328d0f95efe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3270&q=80`,
  `https://images.unsplash.com/photo-1690402687447-87600bae0364?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3132&q=80`,
  `https://images.unsplash.com/photo-1692871480784-4fd78f25459f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2160&q=80`,
  `https://images.unsplash.com/photo-1685516882750-807fa81a949f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3280&q=80`,
]

// 선택한 이미지 파일들을 읽어오기
function readImageFiles(event: Event): void {
  uploadImages.value = []
  const targets = (event?.target as any).files
  for (const target of targets) {
    const src = URL.createObjectURL(target as File)
    uploadImages.value.push(src)
  }
}

// 업로드한 이미지들 본문에 추가하기
function add(): void {
  // axios.post(`/upload`, fd, {header: {Authorization: `Bearer ...`} })
  for (const src of uploadedImages) {
    emits("addImageURL", src)
  }
}

// 알림 내용 지정
const showAlert = ref<boolean>(false)
const alertText = ref<string>("")
const alertType = ref<"error" | "success" | "warning" | "info">("success")
</script>
