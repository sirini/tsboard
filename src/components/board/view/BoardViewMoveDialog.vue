<template>
  <v-dialog v-model="view.movePostDialog" persistent>
    <v-card :max-width="home.dialogWidth" class="mx-auto" :color="COLOR.HOME.MAIN" rounded="xl">
      <v-card-title>{{ TEXT[home.lang].MOVE }}</v-card-title>
      <v-divider></v-divider>
      <v-list :bg-color="COLOR.HOME.MAIN">
        <v-list-item>{{ TEXT[home.lang].MOVE_INFO }}</v-list-item>
        <v-list-item>
          <v-text-field
            v-model="view.moveTarget.name"
            hide-details
            readonly
            variant="outlined"
            class="mt-2 mb-4"
            width="300"
            rounded="pill"
            :label="TEXT[home.lang].MOVE_TARGET"
            append-inner-icon="mdi-chevron-down"
          >
            <v-menu activator="parent">
              <v-list :bg-color="COLOR.HOME.MAIN" density="compact" rounded="xl">
                <v-list-item
                  v-for="(board, index) in view.boardListItems"
                  :key="index"
                  @click="view.selectMoveTarget(board)"
                >
                  {{ util.unescape(board.name) }}
                  <v-tooltip activator="parent">{{ util.unescape(board.info) }}</v-tooltip>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-text-field>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn prepend-icon="mdi-close" @click="view.closeMoveDialog" rounded="pill">{{
          TEXT[home.lang].CLOSE
        }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn append-icon="mdi-chevron-right" @click="view.applyMovePost" rounded="pill">{{
          TEXT[home.lang].APPLY
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { COLOR } from "../../../../tsboard.config"
import { TEXT } from "../../../messages/pages/board/view"
import { useBoardViewStore } from "../../../store/board/view"
import { useHomeStore } from "../../../store/home"
import { useUtilStore } from "../../../store/util"

const home = useHomeStore()
const view = useBoardViewStore()
const util = useUtilStore()
</script>
