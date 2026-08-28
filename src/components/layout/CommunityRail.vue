<script setup lang="ts">
import { Code2, Gauge, ShieldCheck } from "lucide-vue-next"
import { TSBOARD } from "../../../tsboard.config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
</script>

<template>
  <div class="space-y-3">
    <Card
      ><CardHeader
        ><CardTitle>{{ $t("community.welcome", { site: TSBOARD.siteName }) }}</CardTitle
        ><CardDescription>{{ $t("app.tagline") }}</CardDescription></CardHeader
      ><CardContent class="space-y-3 text-sm text-muted-foreground"
        ><p class="flex gap-2">
          <Gauge class="mt-0.5 size-4 shrink-0 text-primary" />{{ $t("community.lightweight") }}
        </p>
        <p class="flex gap-2">
          <ShieldCheck class="mt-0.5 size-4 shrink-0 text-primary" />{{ $t("community.secure") }}
        </p>
        <p class="flex gap-2">
          <Code2 class="mt-0.5 size-4 shrink-0 text-primary" />{{ $t("community.openSource") }}
        </p>
        <Button as-child variant="outline" class="w-full"
          ><RouterLink to="/about">{{ $t("community.learn") }}</RouterLink></Button
        ></CardContent
      ></Card
    >
    <div class="px-2 text-xs text-muted-foreground">
      <RouterLink to="/terms" class="hover:underline">{{ $t("common.terms") }}</RouterLink
      ><span class="px-2">·</span
      ><RouterLink to="/privacy" class="hover:underline">{{ $t("common.privacy") }}</RouterLink
      ><span class="px-2">·</span>v{{ TSBOARD.version }}
    </div>
  </div>
</template>
