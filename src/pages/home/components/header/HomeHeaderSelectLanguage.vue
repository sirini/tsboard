<template>
  <v-btn icon>
    <v-icon>mdi-translate</v-icon>

    <v-menu activator="parent">
      <v-list>
        <v-list-item @click="home.changeUserLanguage(LANG.KO as LangType)">
          한국어
          <template v-slot:append v-if="home.lang === (LANG.KO as LangType)">
            <v-icon>mdi-check</v-icon>
          </template>
        </v-list-item>
        <v-list-item @click="home.changeUserLanguage(LANG.EN as LangType)">
          English
          <template v-slot:append v-if="home.lang === (LANG.EN as LangType)">
            <v-icon>mdi-check</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../../../store/home"
import { LANG, LangType } from "../../../../interface/home"

const home = useHomeStore()
</script>
