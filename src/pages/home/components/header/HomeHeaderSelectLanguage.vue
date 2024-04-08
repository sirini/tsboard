<template>
  <v-btn icon>
    <v-icon>{{ home.langIcon }}</v-icon>

    <v-menu activator="parent">
      <select-language></select-language>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../../../store/home"
import SelectLanguage from "../../components/common/SelectLanguage.vue"

const home = useHomeStore()
</script>
