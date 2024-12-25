<template>
  <v-divider class="mt-3"></v-divider>
  <v-card-actions class="mt-3 pa-0">
    <v-btn
      prepend-icon="mdi-view-list"
      @click="util.go(util.routerName(type, BOARD_ACTION.LIST), view.id)"
      >{{ TEXT[home.lang].LIST }}</v-btn
    >

    <v-spacer></v-spacer>

    <v-btn
      prepend-icon="mdi-pencil"
      variant="flat"
      :color="home.color.header"
      @click="util.go(util.routerName(type, BOARD_ACTION.WRITE), view.id)"
      :disabled="auth.user.uid < 1"
      >{{ TEXT[home.lang].WRITE }}</v-btn
    >
  </v-card-actions>
</template>

<script setup lang="ts">
import { Board, BOARD_ACTION } from "../../../interface/board_interface"
import { TEXT } from "../../../messages/pages/board/view"
import { useBoardViewStore } from "../../../store/board/view"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"

const view = useBoardViewStore()
const util = useUtilStore()
const auth = useAuthStore()
const home = useHomeStore()
const props = defineProps<{ type: Board }>()
</script>
