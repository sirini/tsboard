<template>
  <v-alert
    v-model="util.alertbar"
    :type="util.alertType"
    :text="util.alertText"
    variant="tonal"
    rounded="xl"
    closable
    @click.close="util.alertbar = false"
  ></v-alert>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useUtilStore } from "../../store/util"

const util = useUtilStore()

// 타임아웃되면 닫아주기
onMounted(() => {
  setTimeout(() => {
    util.alertbar = false
  }, util.alertTimeout)
})
</script>
