<template>
  <v-dialog v-model="write.uploadImageDialog" persistent>
    <v-card width="500" class="mx-auto" :color="home.color.header">
      <v-card-title>본문 삽입용 이미지 업로드</v-card-title>
      <v-divider></v-divider>

      <v-card-text class="dialogBody">
        <alert-bar></alert-bar>
        <v-card variant="tonal" class="mt-2 mb-5">
          <v-card-text class="pa-3">
            본문에 이미지를 추가하기 위한 업로드는 가로폭이 <strong>1000px</strong> 보다 클 경우
            자동으로 줄여서 저장됩니다. 원본 크기로 첨부가 필요할 경우 파일 첨부 기능을
            이용하세요!</v-card-text
          >
        </v-card>
        <v-file-input
          @change="write.readSelectedFiles"
          class="mb-3"
          show-size
          counter
          :rules="write.uploadRule"
          accept="image/png, image/jpeg, image/gif, image/bmp, image/heif, image/heic"
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
        <v-btn prepend-icon="mdi-close" @click="write.uploadImageDialog = false">닫기</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="add" color="primary"
          >위 사진들을 업로드 하고 본문에 추가하기 <v-icon>mdi-chevron-right</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useWriteStore } from "../../../store/write"
import { useUtilStore } from "../../../store/util"
import { useHomeStore } from "../../../store/home"
import AlertBar from "../../util/AlertBar.vue"

const util = useUtilStore()
const home = useHomeStore()
const emits = defineEmits<{
  addImageURL: [src: string]
}>()
const write = useWriteStore()
const uploadImages = ref<string[]>([])

// 선택한 이미지 파일들을 읽어오기
watch(
  () => write.files,
  (value: File[]) => {
    for (const v of value) {
      const src = URL.createObjectURL(v)
      uploadImages.value.push(src)
    }
  },
)

// 업로드한 이미지들 본문에 추가하기
function add(): void {
  // axios.post(`/upload`, fd, {header: {Authorization: `Bearer ...`} })
  for (const src of uploadImages.value) {
    emits("addImageURL", src)
  }
  util.success("사진을 작성중인 본문에 추가 하였습니다")
}
</script>

<style scoped>
.dialogBody {
  background-color: white;
  overflow-y: scroll;
}
</style>
