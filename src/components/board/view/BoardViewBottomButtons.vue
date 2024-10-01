<template>
  <v-divider class="mt-3"></v-divider>
  <v-card-actions class="mt-3 pa-0">
    <v-btn
      prepend-icon="mdi-view-list"
      @click="util.go(util.routerName(type, ACTION_TARGET.LIST), view.id)"
      >{{ TEXT[home.lang].LIST }}</v-btn
    >

    <v-spacer></v-spacer>

    <v-btn
      prepend-icon="mdi-pencil"
      variant="flat"
      color="blue-grey"
      @click="util.go(util.routerName(type, ACTION_TARGET.WRITE), view.id)"
      :disabled="auth.user.uid < 1"
      >{{ TEXT[home.lang].WRITE }}</v-btn
    >
  </v-card-actions>
</template>

<script setup lang="ts">
import { ACTION_TARGET } from "../../../../server/database/board/const"
import { BoardType } from "../../../interface/board"
import { TEXT } from "../../../messages/pages/board/view"
import { useBoardViewStore } from "../../../store/board/view"
import { useHomeStore } from "../../../store/home"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"

const view = useBoardViewStore()
const util = useUtilStore()
const auth = useAuthStore()
const home = useHomeStore()
const props = defineProps<{ type: BoardType }>()
</script>
