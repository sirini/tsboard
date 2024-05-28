<template>
  <router-view />
</template>

<script setup lang="ts">
import { useHomeStore } from "./store/home"

const home = useHomeStore()
home.visit()
</script>

<style>
.v-application {
  font-family: "IBM Plex Sans KR", sans-serif;
  font-weight: 400;
}

body {
  --sb-track-color: #eceff1;
  --sb-thumb-color: #546e7a;
  --sb-size: 3px;

  scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);
}

body::-webkit-scrollbar {
  width: var(--sb-size);
}

body::-webkit-scrollbar-track {
  background: var(--sb-track-color);
}

body::-webkit-scrollbar-thumb {
  background: var(--sb-thumb-color);
}
</style>
