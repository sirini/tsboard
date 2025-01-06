<template>
  <v-footer class="footer" :color="COLOR.HOME.FOOTER">
    <v-card elevation="0" rounded="0" class="mx-auto" :color="COLOR.HOME.FOOTER">
      <v-card-actions class="pa-0">
        <v-spacer></v-spacer>
        <v-btn class="mx-2" rounded="pill" @click="home.coming" :color="COLOR.HOME.MAIN">{{
          TEXT[home.lang].HOME
        }}</v-btn>
        <v-btn class="mx-2" rounded="pill" @click="util.go('about')" :color="COLOR.HOME.MAIN">{{
          TEXT[home.lang].ABOUT
        }}</v-btn>
        <v-btn class="mx-2" rounded="pill" @click="util.go('copyright')" :color="COLOR.HOME.MAIN">{{
          TEXT[home.lang].LICENSE
        }}</v-btn>
        <v-btn class="mx-2" rounded="pill" @click="util.go('policy')" :color="COLOR.HOME.MAIN">{{
          TEXT[home.lang].POLICY
        }}</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-footer>
</template>

<script setup lang="ts">
import { COLOR } from "../../../tsboard.config"
import { TEXT } from "../../messages/pages/home/home-footer"
import { useHomeStore } from "../../store/home"
import { useUtilStore } from "../../store/util"

const home = useHomeStore()
const util = useUtilStore()
</script>

<style type="scss" scoped>
.footer {
  min-height: 64px;
  padding: 0;
}
</style>
