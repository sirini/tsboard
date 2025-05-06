<template>
  <router-view />
</template>

<script setup lang="ts">
import { useHomeStore } from "./store/home"

const home = useHomeStore()
home.visit()
</script>

<style>
@font-face {
  font-family: "0xProto Nerd Font Mono";
  src: url("/src/assets/fonts/0xProtoNerdFontMono-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Cal Sans";
  src: url("/src/assets/fonts/CalSans-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Pretendard";
  src: url("/src/assets/fonts/Pretendard-ExtraThin.woff2") format("woff2");
  font-weight: 100;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Pretendard";
  src: url("/src/assets/fonts/Pretendard-Thin.woff2") format("woff2");
  font-weight: 200;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Pretendard";
  src: url("/src/assets/fonts/Pretendard-Light.woff2") format("woff2");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Pretendard";
  src: url("/src/assets/fonts/Pretendard-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Pretendard";
  src: url("/src/assets/fonts/Pretendard-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Pretendard";
  src: url("/src/assets/fonts/Pretendard-SemiBold.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Pretendard";
  src: url("/src/assets/fonts/Pretendard-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Pretendard";
  src: url("/src/assets/fonts/Pretendard-ExtraBold.woff2") format("woff2");
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}

.v-application {
  font-family: "Cal Sans", "Pretendard", sans-serif;
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
