<template>
  <v-card> Board manager {{ route.params?.id }} </v-card>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"

const route = useRoute()
</script>
