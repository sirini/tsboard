<template>
  <v-list>
    <v-list-item
      prepend-icon="mdi-syllabary-hangul"
      @click="home.changeUserLanguage(LANG.KO as LangType)"
    >
      한국어
      <template v-slot:append v-if="home.lang === (LANG.KO as LangType)">
        <v-icon>mdi-check</v-icon>
      </template>
    </v-list-item>
    <v-divider></v-divider>

    <v-list-item
      prepend-icon="mdi-alphabetical-variant"
      @click="home.changeUserLanguage(LANG.EN as LangType)"
    >
      English
      <template v-slot:append v-if="home.lang === (LANG.EN as LangType)">
        <v-icon>mdi-check</v-icon>
      </template>
    </v-list-item>
    <v-divider></v-divider>

    <v-list-item
      prepend-icon="mdi-ideogram-cjk"
      @click="home.changeUserLanguage(LANG.CN as LangType)"
    >
      中文
      <template v-slot:append v-if="home.lang === (LANG.CN as LangType)">
        <v-icon>mdi-check</v-icon>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../../../store/home"
import { LangType, LANG } from "../../../../interface/home"

const home = useHomeStore()
</script>
