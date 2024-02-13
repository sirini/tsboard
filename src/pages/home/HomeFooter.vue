<template>
  <v-footer class="footer" :color="home.color.footer">
    <v-card elevation="0" rounded="0" class="mx-auto" :color="home.color.footer">
      <v-card-actions class="pa-0">
        <v-spacer></v-spacer>
        <v-btn color="grey" class="mx-2" rounded="xl" @click="util.go('home')">첫화면</v-btn>
        <v-btn color="grey" class="mx-2" rounded="xl" @click="util.go('about')">사이트 소개</v-btn>
        <v-btn color="grey" class="mx-2" rounded="xl" @click="util.go('bugReport')"
          >버그 신고</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-footer>
</template>

<script setup lang="ts">
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"

const home = useHomeStore()
const util = useUtilStore()
</script>

<style type="scss" scoped>
.footer {
  min-height: 48px;
  padding: 0;
  border-top: #cfd8dc 1px solid;
}
</style>
