<template>
  <router-view />
</template>

<script setup lang="ts">
/**
 * App.vue
 *
 * main.ts 에서 호출되며 실질적으로는 src/router/index.ts 에서 매칭되는 페이지들이 보여짐
 * 첫 페이지는 src/pages/home/HomePage.vue 임
 */
</script>

<style>
.v-application {
  font-family: "IBM Plex Sans KR", sans-serif;
  font-weight: 400;
}

body {
  --sb-track-color: #ffffff;
  --sb-thumb-color: #919191;
  --sb-size: 5px;

  scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);
}

body::-webkit-scrollbar {
  width: var(--sb-size);
}

body::-webkit-scrollbar-track {
  background: var(--sb-track-color);
  border-radius: 5px;
}

body::-webkit-scrollbar-thumb {
  background: var(--sb-thumb-color);
  border-radius: 5px;
}
</style>
