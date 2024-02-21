<template>
  <v-dialog v-model="editor.addImageFromDBDialog" persistent>
    <v-card width="700" class="mx-auto" :color="home.color.header">
      <v-card-title>기존 이미지를 본문에 추가/관리</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-card v-show="showRemoveImageInfo" elevation="0" class="mt-2 mb-5" variant="tonal">
          <v-card-text class="pa-3">
            정말로 삭제하시겠습니까? 이전에 사용한 적이 없거나 앞으로도 사용할 계획이 없을 경우에만
            삭제해 주세요! 만약 이전 게시글들에 이미 사용하셨다면, 해당 게시글들은 더 이상 이미지가
            나타나지 않게 됩니다. 계속 진행하시겠습니까?
          </v-card-text>
          <v-card-actions>
            <v-btn prepend-icon="mdi-check" @click="clear">아니요, 삭제하지 않겠습니다</v-btn>
            <v-spacer></v-spacer>
            <v-btn prepend-icon="mdi-trash-can" @click="remove">삭제하기</v-btn>
          </v-card-actions>
        </v-card>

        <v-row no-gutters>
          <v-col v-for="(image, index) in editor.loadImages" :key="index" cols="2">
            <v-img
              cover
              height="100"
              aspect-ratio="1/1"
              :src="PREFIX + image.name"
              class="mr-2 mb-2"
            >
              <div class="action">
                <v-btn
                  @click="add(image.name)"
                  size="small"
                  elevation="0"
                  variant="tonal"
                  color="white"
                  icon
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>

                <v-btn
                  @click="check(image.uid, image.name)"
                  size="small"
                  elevation="0"
                  variant="tonal"
                  color="white"
                  class="ml-1"
                  icon
                >
                  <v-icon>mdi-trash-can</v-icon>
                </v-btn>
              </div>
            </v-img>
          </v-col>

          <v-col v-if="editor.loadImages.length < 1" cols="12">
            이 게시판에서 아직 업로드하신 이미지가 없습니다.
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn block prepend-icon="mdi-close" @click="editor.addImageFromDBDialog = false"
          >닫기</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useHomeStore } from "../../../store/home"
import { Pair } from "../../../interface/board"

const editor = useBoardEditorStore()
const home = useHomeStore()
const emits = defineEmits<{
  addImageURL: [src: string]
  removeImage: [src: string]
}>()
const PREFIX = process.env.PREFIX || ""
const showRemoveImageInfo = ref<boolean>(false)
const removeImageTarget = ref<Pair>({
  uid: 0,
  name: "",
})

onMounted(() => editor.loadUploadedImages())

// 기존에 업로드한 이미지 추가하기
function add(src: string): void {
  emits("addImageURL", PREFIX + src)
}

// 이미지 삭제하기 전에 확인하기
function check(uid: number, src: string): void {
  showRemoveImageInfo.value = true
  removeImageTarget.value = { uid, name: PREFIX + src }
}

// 업로드한 이미지 삭제하기 (작성중인 본문에서도 제거)
function remove(): void {
  emits("removeImage", removeImageTarget.value.name)
  // TODO 서버에 올려진 사진 파일 / DB 레코드 제거
  editor.loadImages = editor.loadImages.filter((value) => {
    return value.uid !== removeImageTarget.value.uid
  })
  clear()
}

// 삭제하지 않기
function clear(): void {
  showRemoveImageInfo.value = false
  removeImageTarget.value = { uid: 0, name: "" }
}
</script>

<style scoped>
.action {
  position: absolute;
  bottom: 5px;
  left: 5px;
}

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
