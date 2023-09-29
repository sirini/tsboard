<template>
  <v-chip pill>
    <v-avatar start>
      <v-img :src="profile"></v-img>
    </v-avatar>
    writer
  </v-chip>
</template>

<script setup lang="ts">
const profile = "https://cdn.vuetifyjs.com/images/john.png"
</script>
