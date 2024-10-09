<template>
  <v-dialog v-model="image.addImageFromDBDialog" persistent>
    <v-card :max-width="home.dialogWidth" class="mx-auto" rounded="lg" :color="home.color.header">
      <v-card-title
        >{{ TEXT[home.lang].TITLE_MANAGE_IMAGE }} ({{ image.totalImageCount }} ea)</v-card-title
      >
      <v-divider></v-divider>
      <alert-bar></alert-bar>

      <v-card-text>
        <v-card v-show="image.showRemoveImageInfo" elevation="0" class="mt-2 mb-5" variant="tonal">
          <v-card-text class="pa-3">
            {{ TEXT[home.lang].CHECK_BEFORE_REMOVE_IMAGE }}
          </v-card-text>
          <v-card-actions>
            <v-btn prepend-icon="mdi-check" @click="image.clearRemoveTarget">{{
              TEXT[home.lang].CANCEL_REMOVE
            }}</v-btn>
            <v-spacer></v-spacer>
            <v-btn prepend-icon="mdi-trash-can" @click="remove" color="red">{{
              TEXT[home.lang].CONFIRM_REMOVE
            }}</v-btn>
          </v-card-actions>
        </v-card>

        <v-row no-gutters>
          <v-col v-for="(img, index) in image.loadImages" :key="index" cols="3">
            <v-card elevation="0" rounded="lg" class="ma-1">
              <v-img cover aspect-ratio="1/1" :src="TSBOARD.PREFIX + img.name">
                <div class="action">
                  <v-row no-gutters>
                    <v-col
                      ><v-btn block @click="add(img.name)" size="small" elevation="0" rounded="0">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-btn
                        block
                        @click="image.setRemoveTarget(img.uid, img.name)"
                        size="small"
                        elevation="0"
                        rounded="0"
                        color="red"
                      >
                        <v-icon>mdi-trash-can</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-img>
            </v-card>
          </v-col>

          <v-col v-if="image.loadImages.length < 1" cols="12">
            {{ TEXT[home.lang].EMPTY_IMAGE_LIST }}
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
              @click="image.loadUploadedImages(true)"
              >{{ TEXT[home.lang].LOAD_PREV_IMAGE }}</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn block prepend-icon="mdi-close" @click="image.addImageFromDBDialog = false">{{
          TEXT[home.lang].CLOSE
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch } from "vue"
import { TSBOARD } from "../../../../tsboard.config"
import { TEXT } from "../../../messages/components/board/write/board-write-editor-others"
import { useBoardEditorStore } from "../../../store/board/editor"
import { useEditorImageStore } from "../../../store/board/image"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"
import AlertBar from "../../util/AlertBar.vue"

const editor = useBoardEditorStore()
const image = useEditorImageStore()
const util = useUtilStore()
const home = useHomeStore()
const emits = defineEmits<{
  addImageURL: [src: string]
  removeImage: [src: string]
}>()

watch(
  () => image.addImageFromDBDialog,
  (value) => {
    if (value) {
      image.boardUid = editor.config.uid
      image.loadUploadedImages(false)
    }
  },
)

// 기존에 업로드한 이미지 추가하기
function add(src: string): void {
  emits("addImageURL", src)
  util.snack(TEXT[home.lang].ADD_TO_CONTENT)
}

// 업로드한 이미지 삭제하기 (작성중인 본문에서도 제거)
async function remove(): Promise<void> {
  emits("removeImage", image.removeImageTarget.name)
  await image.removeUploadedImage(image.removeImageTarget.uid)
  image.loadImages = image.loadImages.filter((value) => {
    return value.uid !== image.removeImageTarget.uid
  })
  image.clearRemoveTarget()
}
</script>

<style scoped>
.action {
  display: flex;
  height: 120px;
  justify-content: center;
  align-items: end;
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
