<template>
  <v-card-actions class="pa-0">
    <v-btn prepend-icon="mdi-text-search-variant"
      >{{ TEXT[home.lang].SEARCH }}
      <v-menu activator="parent" :close-on-content-click="false">
        <gallery-list-search></gallery-list-search>
      </v-menu>
    </v-btn>

    <v-spacer></v-spacer>

    <v-chip variant="tonal" color="blue-grey-lighten-3">
      {{ gallery.page }} / {{ gallery.pageLength }}
    </v-chip>
    <v-spacer></v-spacer>

    <v-btn
      prepend-icon="mdi-list-box-outline"
      @click="gallery.list"
      v-if="home.isMobile === false"
      >{{ TEXT[home.lang].LIST }}</v-btn
    >

    <v-btn
      prepend-icon="mdi-upload"
      @click="util.go('galleryWrite', gallery.id)"
      :disabled="auth.user.uid < 1"
      >{{ TEXT[home.lang].UPLOAD }}</v-btn
    >
  </v-card-actions>
</template>

<script setup lang="ts">
import { useGalleryStore } from "../../../store/board/gallery/gallery"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"
import { useHomeStore } from "../../../store/home"
import GalleryListSearch from "./GalleryListSearch.vue"
import { TEXT } from "../../../messages/components/gallery/list/gallery-list-search"

const gallery = useGalleryStore()
const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()
</script>
