<template>
  <v-divider class="mt-3"></v-divider>
  <v-card-actions class="mt-3 pa-0">
    <v-btn
      prepend-icon="mdi-view-list"
      @click="util.go(util.routerName(view.config.type, BOARD_ACTION.LIST), view.id)"
      rounded="pill"
      :color="COLOR.HOME.MAIN"
      >{{ TEXT[home.lang].LIST }}</v-btn
    >

    <v-spacer></v-spacer>

    <v-btn
      prepend-icon="mdi-pencil"
      variant="flat"
      :color="COLOR.HOME.MAIN"
      @click="util.go(util.routerName(view.config.type, BOARD_ACTION.WRITE), view.id)"
      :disabled="auth.user.uid < 1"
      rounded="pill"
      >{{ TEXT[home.lang].WRITE }}</v-btn
    >
  </v-card-actions>
</template>

<script setup lang="ts">
import { COLOR } from "../../../../tsboard.config"
import { BOARD_ACTION } from "../../../interface/board_interface"
import { TEXT } from "../../../messages/pages/board/view"
import { useBoardViewStore } from "../../../store/board/view"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"

const view = useBoardViewStore()
const util = useUtilStore()
const auth = useAuthStore()
const home = useHomeStore()
</script>
