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
  </v-footer>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()
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
