<template>
  <v-footer class="footer">
    <v-row>
      <v-col>
        <v-card elevation="0" rounded="0" class="mx-auto">
          <v-card-actions>
            <v-divider></v-divider>
            <v-btn
              color="grey"
              class="mx-2 tsboard"
              rounded="xl"
              @click="router.push({ name: 'tsboard' })"
              >TSBOARD.DEV</v-btn
            >
            <v-divider></v-divider>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="admin.snackbar">
      {{ admin.snackbarMessage }}
      <template v-slot:actions>
        <v-btn icon @click="admin.snackbar = false"><v-icon>mdi-close</v-icon></v-btn>
      </template>
    </v-snackbar>
  </v-footer>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useAdminStore } from "../../../store/admin"

const router = useRouter()
const admin = useAdminStore()
</script>

<style type="scss" scoped>
.footer {
  margin-top: 80px;
  .tsboard {
    font-family: "Oswald", sans-serif;
    color: #9e9e9e;
    font-size: 0.9em;
  }
}
</style>
