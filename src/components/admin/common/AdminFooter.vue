<template>
  <v-footer class="footer" color="blue-grey-lighten-5">
    <v-container>
      <v-row>
        <v-col>
          <v-card elevation="0" rounded="0" class="mx-auto" color="blue-grey-lighten-5">
            <v-card-actions>
              <v-divider></v-divider>
              <v-btn
                color="grey"
                class="mx-2 tsboard"
                rounded="xl"
                @click="router.push({ name: 'tsboard' })"
                >TSBOARD.DEV
                <v-tooltip activator="parent" location="bottom">
                  클릭하시면 TSBOARD 공식 사이트로 이동합니다! 이곳에서 궁금하신 내용을 물어보거나,
                  다른 사용자분들의 팁들을 배워 보실 수 있습니다!
                </v-tooltip>
              </v-btn>
              <v-divider></v-divider>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar v-model="admin.snackbar" :color="admin.snackbarColor">
        {{ admin.snackbarMessage }}
        <template v-slot:actions>
          <v-btn icon @click="admin.snackbar = false" elevation="0"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </template>
      </v-snackbar>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useAdminStore } from "../../../store/admin/common"

const router = useRouter()
const admin = useAdminStore()
</script>

<style type="scss" scoped>
.footer {
  margin-top: 80px;
  .tsboard {
    font-family: "IBM Plex Sans KR", sans-serif;
    color: #9e9e9e;
    font-size: 0.9em;
  }
}
</style>
