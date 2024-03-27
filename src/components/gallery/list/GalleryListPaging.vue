<template>
  <v-card-actions class="pa-0">
    <v-btn prepend-icon="mdi-text-search-variant"
      >검색
      <v-menu activator="parent" :close-on-content-click="false">
        <gallery-list-search></gallery-list-search>
      </v-menu>
    </v-btn>
    <v-btn @click="gallery.loadOldPhotos" class="ml-3 mr-3" prepend-icon="mdi-refresh">
      이전글
    </v-btn>

    <v-spacer></v-spacer>
    <v-chip variant="tonal" color="blue-grey-lighten-3">
      {{ gallery.page }} / {{ gallery.pageLength }}
    </v-chip>
    <v-spacer></v-spacer>

    <v-btn prepend-icon="mdi-list-box-outline" class="ml-3 mr-3" @click="gallery.list">목록</v-btn>
    <v-btn
      prepend-icon="mdi-upload"
      @click="util.go('boardWrite', gallery.id)"
      :disabled="auth.user.uid < 1"
      >업로드</v-btn
    >
  </v-card-actions>
</template>

<script setup lang="ts">
import { useGalleryStore } from "../../../store/board/gallery/gallery"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"
import GalleryListSearch from "./GalleryListSearch.vue"

const gallery = useGalleryStore()
const auth = useAuthStore()
const util = useUtilStore()
</script>
