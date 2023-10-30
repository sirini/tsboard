<template>
  <v-card elevation="0">
    <v-list>
      <v-list-item class="mb-2"> board group general </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useAdminGroupGeneralStore } from "../../../store/admin/group/general"

const general = useAdminGroupGeneralStore()
</script>
