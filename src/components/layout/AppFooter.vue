<script setup lang="ts">
import { TSBOARD } from "../../../tsboard.config"
</script>
<template>
  <footer class="mt-8 border-t py-8">
    <div
      class="mx-auto flex max-w-[1480px] flex-col gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
    >
      <p>
        {{ $t("community.footer", { year: new Date().getFullYear(), site: TSBOARD.siteName }) }}
      </p>
      <nav class="flex gap-4">
        <RouterLink to="/about" class="hover:text-foreground">{{ $t("common.about") }}</RouterLink
        ><RouterLink to="/terms" class="hover:text-foreground">{{ $t("common.terms") }}</RouterLink
        ><RouterLink to="/privacy" class="hover:text-foreground">{{
          $t("common.privacy")
        }}</RouterLink>
      </nav>
    </div>
  </footer>
</template>
