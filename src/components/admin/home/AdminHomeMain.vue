<template>
  <v-card elevation="0"> 여기에 간단한 통계 </v-card>
</template>

<script setup lang="ts">
import { useAdminHomeMainStore } from "../../../store/admin/home/main"

const main = useAdminHomeMainStore()
</script>
