<template>
  <v-card> Member manager {{ route.params?.uid }} </v-card>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"

const route = useRoute()
</script>
