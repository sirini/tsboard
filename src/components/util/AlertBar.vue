<template>
  <v-alert
    v-model="util.alertbar"
    class="mt-3"
    :type="util.alertType"
    :text="util.alertText"
    variant="tonal"
    closable
    @click.close="util.alertbar = false"
  ></v-alert>
</template>

<script setup lang="ts">
import { watchEffect } from "vue"
import { useUtilStore } from "../../store/util"

const util = useUtilStore()

// 타임아웃되면 닫아주기
watchEffect(() => {
  if (util.alertbar) {
    setTimeout(() => {
      util.alertbar = false
    }, util.alertTimeout)
  }
})
</script>
