<template>
  <v-card :width="gallery.width" elevation="0" rounded="0" class="mx-auto">
    <v-form fast-fail @submit.prevent>
      <gallery-header></gallery-header>
      <v-alert v-if="showAlertBox" :type="alertType" :text="alertText" class="mt-3"></v-alert>
      <v-list class="pa-0">
        <v-list-item class="pa-0 mt-3">
          <v-text-field
            v-model="title"
            :rules="util.textRule"
            class="mt-2"
            prepend-icon="mdi-pencil"
            label="사진의 제목을 입력해 주세요"
          ></v-text-field>
        </v-list-item>
        <v-list-item class="pa-0 mt-3">
          <v-file-input
            @change="util.read"
            show-size
            counter
            :rules="util.uploadRule"
            accept="image/png, image/jpeg, image/gif, image/bmp, image/heif, image/heic"
            multiple
            label="업로드할 사진들을 선택해 주세요"
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
        </v-list-item>
      </v-list>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useGalleryStore } from "../../store/gallery"
import { useUtilStore } from "../../store/util"
import GalleryHeader from "../../components/gallery/common/GalleryHeader.vue"

const gallery = useGalleryStore()
const util = useUtilStore()
const showAlertBox = ref<boolean>(true)
const alertType = ref<"success" | "error">("error")
const alertText = ref<string>("이 곳에 에러 메시지 출력")
const title = ref<string>("")

// 알림 메시지 보여주기
function showAlert(text: string, type: "success" | "error" = "error"): void {
  alertType.value = type
  alertText.value = text
  showAlertBox.value = true
}
</script>
