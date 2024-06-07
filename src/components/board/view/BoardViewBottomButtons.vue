<template>
  <v-divider class="mt-3"></v-divider>
  <v-card-actions class="mb-12">
    <v-btn
      prepend-icon="mdi-view-list"
      @click="util.go(util.routerName(type, ACTION_TARGET.LIST), view.id)"
      >{{ TEXT[home.lang].LIST }}</v-btn
    >
    <v-spacer></v-spacer>
    <v-btn
      prepend-icon="mdi-pencil"
      variant="text"
      @click="util.go(util.routerName(type, ACTION_TARGET.WRITE), view.id)"
      :disabled="auth.user.uid < 1"
      >{{ TEXT[home.lang].WRITE }}</v-btn
    >
  </v-card-actions>
</template>

<script setup lang="ts">
import { useBoardViewStore } from "../../../store/board/view"
import { useUtilStore } from "../../../store/util"
import { useAuthStore } from "../../../store/user/auth"
import { useHomeStore } from "../../../store/home"
import { TEXT } from "../../../messages/pages/board/view"
import { ACTION_TARGET } from "../../../../server/database/board/const"
import { BoardType } from "../../../interface/board"

const view = useBoardViewStore()
const util = useUtilStore()
const auth = useAuthStore()
const home = useHomeStore()
const props = defineProps<{ type: BoardType }>()
</script>
