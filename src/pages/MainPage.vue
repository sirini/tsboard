<template>
  <h1>TSBOARD.dev</h1>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()
router.push({ name: "board", params: { id: "test" } })
</script>
