<template>
  <v-footer :color="home.color" class="mt-16">
    <v-card elevation="0" class="mx-auto" :color="home.color">
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" class="mx-2 tsboard" rounded="xl" @click="util.go('tsboard')">
          <v-icon color="blue-grey-lighten-4" size="large">mdi-alpha-t-box</v-icon>
          <v-icon color="blue-grey-lighten-4" size="large">mdi-alpha-s-box</v-icon>
          <v-icon color="blue-grey-lighten-4" size="large">mdi-alpha-b-box-outline</v-icon>
          <v-icon color="blue-grey-lighten-4" size="large">mdi-alpha-o-box-outline</v-icon>
          <v-icon color="blue-grey-lighten-4" size="large">mdi-alpha-a-box-outline</v-icon>
          <v-icon color="blue-grey-lighten-4" size="large">mdi-alpha-r-box-outline</v-icon>
          <v-icon color="blue-grey-lighten-4" size="large">mdi-alpha-d-box-outline</v-icon>
          <v-tooltip activator="parent" location="top">
            클릭하시면 TSBOARD 공식 사이트로 이동합니다! 이곳에서 궁금하신 내용을 물어보거나, 다른
            사용자분들의 팁들을 배워 보실 수 있습니다!
          </v-tooltip>
        </v-btn>
        <v-spacer></v-spacer>
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
import { useHomeStore } from "../../../store/home"

const util = useUtilStore()
const admin = useAdminStore()
const home = useHomeStore()
</script>
