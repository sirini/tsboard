<template>
  <v-footer :color="COLOR.ADMIN.FOOTER" class="mt-16 mb-8">
    <v-card elevation="0" class="mx-auto" :color="COLOR.ADMIN.FOOTER">
      <v-card-actions>
        <v-btn class="mx-3 tsboard" rounded="pill" @click="util.open('https://tsboard.dev')">
          TSBOARD ({{ TSBOARD.VERSION }})
          <v-tooltip activator="parent" location="top">
            클릭하시면 TSBOARD 공식 사이트로 이동합니다! 이곳에서 궁금하신 내용을 물어보거나, 다른
            사용자분들의 팁들을 배워 보실 수 있습니다!
          </v-tooltip>
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="admin.snackbar" :color="admin.snackbarColor">
      {{ admin.snackbarMessage }}
      <template v-slot:actions>
        <v-btn icon @click="admin.snackbar = false" elevation="0"><v-icon>mdi-close</v-icon></v-btn>
      </template>
    </v-snackbar>
  </v-footer>
</template>

<script setup lang="ts">
import { useUtilStore } from "../../../store/util"
import { useAdminStore } from "../../../store/admin/common"
import { COLOR, TSBOARD } from "../../../../tsboard.config"

const util = useUtilStore()
const admin = useAdminStore()
</script>

<style scoped>
.tsboard {
  font-family: "Protest Strike", sans-serif;
  opacity: 0.1;
}
</style>
