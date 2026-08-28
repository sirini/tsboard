<script setup lang="ts">
import { Home } from "lucide-vue-next"
import EmptyState from "@/components/common/EmptyState.vue"
import { Button } from "@/components/ui/button"
</script>
<template>
  <div class="py-16">
    <EmptyState :title="$t('errors.notFound')" :message="$t('errors.notFoundDescription')"
      ><Button as-child
        ><RouterLink to="/"><Home />{{ $t("errors.goHome") }}</RouterLink></Button
      ></EmptyState
    >
  </div>
</template>
