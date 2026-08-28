<script setup lang="ts">
import { Home } from "lucide-vue-next"
import EmptyState from "@/components/common/EmptyState.vue"
import { Button } from "@/components/ui/button"
</script>
<template>
  <div class="py-16">
    <EmptyState title="Page not found" message="The link may be old, or the page may have moved."
      ><Button as-child
        ><RouterLink to="/"><Home />Go home</RouterLink></Button
      ></EmptyState
    >
  </div>
</template>
