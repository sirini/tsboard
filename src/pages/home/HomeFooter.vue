<template>
  <v-footer class="footer">
    <v-row>
      <v-col>
        <v-card elevation="0" rounded="0" class="mx-auto">
          <v-card-actions>
            <v-divider></v-divider>
            <v-btn color="grey" class="mx-2" rounded="xl" @click="util.go('home')">첫화면</v-btn>
            <v-btn color="grey" class="mx-2" rounded="xl" @click="util.go('about')"
              >사이트 소개</v-btn
            >
            <v-btn color="grey" class="mx-2" rounded="xl" @click="util.go('bugReport')"
              >버그 신고</v-btn
            >
            <v-divider></v-divider>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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
  margin-top: 80px;
  .bottom {
    font-family: "Oswald", sans-serif;
    color: #9e9e9e;
    font-size: 0.9em;
  }
}
</style>
