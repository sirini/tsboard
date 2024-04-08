<template>
  <v-list>
    <v-list-subheader>Language</v-list-subheader>
    <v-divider></v-divider>
    <v-list-item :prepend-icon="home.langIcon" append-icon="mdi-chevron-down" @click=""
      >{{ home.langName }}
      <v-menu activator="parent">
        <select-language></select-language>
      </v-menu>
    </v-list-item>
    <v-divider></v-divider>
  </v-list>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../../../store/home"
import SelectLanguage from "../common/SelectLanguage.vue"

const home = useHomeStore()
</script>
