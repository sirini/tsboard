<template>
  <v-card-actions class="mt-3 pa-0">
    <v-btn icon size="small">
      <v-icon>mdi-magnify</v-icon>
      <v-menu activator="parent" :close-on-content-click="false">
        <gallery-list-search></gallery-list-search>
      </v-menu>
      <v-tooltip activator="parent">{{ TEXT[home.lang].SEARCH }}</v-tooltip>
    </v-btn>

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
      variant="flat"
      :color="home.color.header"
      >{{ TEXT[home.lang].UPLOAD }}</v-btn
    >
  </v-card-actions>
</template>

<script setup lang="ts">
import { TEXT } from "../../../messages/components/gallery/list/gallery-list-search"
import { useGalleryStore } from "../../../store/board/gallery"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"
import GalleryListSearch from "./GalleryListSearch.vue"

const gallery = useGalleryStore()
const auth = useAuthStore()
const util = useUtilStore()
const home = useHomeStore()
</script>
