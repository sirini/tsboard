<template>
  <v-app>
    <home-header></home-header>
    <v-layout class="layout">
      <v-main>
        <v-container class="wrap">
          <v-card elevation="0" rounded="0" class="mx-auto">
            <v-form fast-fail @submit.prevent>
              <gallery-header></gallery-header>
              <alert-bar></alert-bar>

              <v-list class="pa-0">
                <v-list-item class="pa-0 mt-3">
                  <v-text-field
                    v-model="write.subject"
                    :rules="write.textRule"
                    class="mt-2"
                    prepend-icon="mdi-pencil"
                    variant="outlined"
                    label="사진의 제목을 입력해 주세요"
                  ></v-text-field>
                </v-list-item>

                <v-list-item class="pa-0">
                  <v-file-input
                    @change="write.readSelectedFiles"
                    show-size
                    counter
                    class="pt-3"
                    :rules="write.uploadRule"
                    prepend-icon="mdi-image-plus"
                    accept="image/png, image/jpeg, image/gif, image/bmp, image/heif, image/heic"
                    multiple
                    variant="outlined"
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

                <v-list-item class="pa-0">
                  <v-textarea
                    class="pt-3"
                    v-model="write.content"
                    prepend-icon="mdi-comment-outline"
                    label="사진들에 대해서 소개해 주세요 (어디에서 촬영하셨나요? 마음에 쏙 드는 점은 무엇이었나요?)"
                    variant="outlined"
                    :rules="write.textRule"
                    auto-grow
                  ></v-textarea>
                </v-list-item>

                <v-list-item class="pa-0">
                  <v-text-field
                    v-model="write.tag"
                    :rules="write.textRule"
                    class="pt-2"
                    prepend-icon="mdi-tag-multiple"
                    label="게시글 내용에 적합한 해시태그를 입력해 주세요 (스페이스 키 혹은 콤마로 추가)"
                    @keyup="write.updateTagSuggestion"
                    @keyup.space="write.addTag(write.tag)"
                    @keyup.,="write.addTag(write.tag)"
                    variant="outlined"
                  >
                    <v-menu activator="parent">
                      <v-list>
                        <v-list-item
                          v-for="(tag, index) in write.tagSuggestions"
                          :key="index"
                          prepend-icon="mdi-tag-plus"
                          @click="write.addTag(tag)"
                          >{{ tag }}
                          <v-tooltip activator="parent"> {{ tag }} 태그를 추가합니다 </v-tooltip>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-text-field>

                  <v-card elevation="0" class="mt-2 mb-2">
                    <v-chip
                      v-for="(tag, index) in write.tags"
                      :key="index"
                      closable
                      @click.close="write.removeTag(tag)"
                      class="mt-1 ml-1"
                      >{{ tag }}</v-chip
                    >
                  </v-card>
                </v-list-item>
              </v-list>
            </v-form>

            <v-card-actions>
              <v-btn @click="gallery.confirmCancelDialog = true" prepend-icon="mdi-close"
                >글 작성 취소</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="write.save(gallery.id)" append-icon="mdi-chevron-right"
                >작성 완료하고 보러 가기</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-container>
        <home-footer></home-footer>
      </v-main>
    </v-layout>
    <gallery-upload-cancel-dialog
      @cancel="util.go('galleryList', gallery.id)"
    ></gallery-upload-cancel-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useGalleryStore } from "../../store/gallery"
import { useUtilStore } from "../../store/util"
import { useWriteStore } from "../../store/write"
import { useHomeStore } from "../../store/home"
import GalleryHeader from "../../components/gallery/common/GalleryHeader.vue"
import GalleryUploadCancelDialog from "../../components/gallery/write/GalleryUploadCancelDialog.vue"
import HomeHeader from "../home/HomeHeader.vue"
import HomeFooter from "../home/HomeFooter.vue"
import AlertBar from "../../components/util/AlertBar.vue"

const gallery = useGalleryStore()
const util = useUtilStore()
const write = useWriteStore()
const home = useHomeStore()

onMounted(() => {
  home.color = "blue-grey-lighten-5"
  home.footerColor = "blue-grey-lighten-5"
})
</script>

<style scoped>
.layout {
  margin-top: 64px;
}
.wrap {
  min-height: calc(100vh - 118px);
}
.gallery {
  margin-top: 80px;
}
</style>
