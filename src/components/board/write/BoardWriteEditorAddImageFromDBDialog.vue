<template>
  <v-dialog v-model="image.addImageFromDBDialog" persistent>
    <v-card width="700" class="mx-auto" rounded="lg" :color="home.color.header">
      <v-card-title>기존 이미지를 본문에 추가/관리 ({{ image.totalImageCount }}개)</v-card-title>
      <v-divider></v-divider>
      <alert-bar></alert-bar>

      <v-card-text>
        <v-card v-show="image.showRemoveImageInfo" elevation="0" class="mt-2 mb-5" variant="tonal">
          <v-card-text class="pa-3">
            정말로 삭제하시겠습니까? 이전에 사용한 적이 없거나 앞으로도 사용할 계획이 없을 경우에만
            삭제해 주세요! 만약 이전 게시글들에 이미 사용하셨다면, 해당 게시글들은 더 이상 이미지가
            나타나지 않게 됩니다. 계속 진행하시겠습니까?
          </v-card-text>
          <v-card-actions>
            <v-btn prepend-icon="mdi-check" @click="image.clearRemoveTarget"
              >아니요, 삭제하지 않겠습니다</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn prepend-icon="mdi-trash-can" @click="remove">삭제하기</v-btn>
          </v-card-actions>
        </v-card>

        <v-row no-gutters>
          <v-col v-for="(img, index) in image.loadImages" :key="index" cols="2" class="mb-3">
            <v-card elevation="0" rounded="lg" class="mt-2 mr-2">
              <v-img cover width="105" aspect-ratio="1/1" :src="PREFIX + img.name">
                <div class="action">
                  <v-btn
                    @click="add(img.name)"
                    size="small"
                    elevation="0"
                    variant="tonal"
                    color="white"
                    icon
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>

                  <v-btn
                    @click="image.setRemoveTarget(img.uid, img.name)"
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
            </v-card>
          </v-col>

          <v-col v-if="image.loadImages.length < 1" cols="12">
            이 게시판에서 아직 업로드하신 이미지가 없습니다.
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn
              prepend-icon="mdi-refresh"
              variant="tonal"
              block
              class="mb-3"
              :disabled="image.disableReloadButton"
              @click="image.loadUploadedImages(true, editor.config.uid)"
              >이전 이미지들 가져오기</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn block prepend-icon="mdi-close" @click="image.addImageFromDBDialog = false"
          >닫기</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useEditorImageStore } from "../../../store/board/image"
import { useUtilStore } from "../../../store/util"
import { useHomeStore } from "../../../store/home"
import { EDITOR } from "../../../messages/store/board/editor"
import AlertBar from "../../util/AlertBar.vue"

const editor = useBoardEditorStore()
const image = useEditorImageStore()
const util = useUtilStore()
const home = useHomeStore()
const emits = defineEmits<{
  addImageURL: [src: string]
  removeImage: [src: string]
}>()
const PREFIX = process.env.PREFIX || ""

watch(
  () => image.addImageFromDBDialog,
  () => image.loadUploadedImages(false, editor.config.uid),
)

// 기존에 업로드한 이미지 추가하기
function add(src: string): void {
  emits("addImageURL", PREFIX + src)
}

// 업로드한 이미지 삭제하기 (작성중인 본문에서도 제거)
function remove(): void {
  emits("removeImage", image.removeImageTarget.name)
  image.removeUploadedImage(image.removeImageTarget.uid)
  image.loadImages = image.loadImages.filter((value) => {
    return value.uid !== image.removeImageTarget.uid
  })
  util.snack(EDITOR.REMOVED_IMAGE)
  image.clearRemoveTarget()
}
</script>

<style scoped>
.action {
  display: flex;
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
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
