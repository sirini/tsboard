<template>
  <v-list density="compact">
    <v-list-item
      prepend-icon="mdi-syllabary-hangul"
      @click="home.changeUserLanguage(LANG.KO as HomeLang)"
    >
      한국어
      <template v-slot:append v-if="home.lang === (LANG.KO as HomeLang)">
        <v-icon>mdi-check</v-icon>
      </template>
    </v-list-item>
    <v-divider></v-divider>

    <v-list-item
      prepend-icon="mdi-alphabetical-variant"
      @click="home.changeUserLanguage(LANG.EN as HomeLang)"
    >
      English
      <template v-slot:append v-if="home.lang === (LANG.EN as HomeLang)">
        <v-icon>mdi-check</v-icon>
      </template>
    </v-list-item>
    <v-divider></v-divider>

    <v-list-item
      prepend-icon="mdi-ideogram-cjk"
      @click="home.changeUserLanguage(LANG.CN as HomeLang)"
    >
      中文
      <template v-slot:append v-if="home.lang === (LANG.CN as HomeLang)">
        <v-icon>mdi-check</v-icon>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { LANG, HomeLang } from "../../../../interface/home_interface"
import { useHomeStore } from "../../../../store/home"

const home = useHomeStore()
</script>
