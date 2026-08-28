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
        ><CardTitle>Welcome to {{ TSBOARD.siteName }}</CardTitle
        ><CardDescription>{{ TSBOARD.tagline }}</CardDescription></CardHeader
      ><CardContent class="space-y-3 text-sm text-muted-foreground"
        ><p class="flex gap-2">
          <Gauge class="mt-0.5 size-4 shrink-0 text-primary" />A lightweight Vue SPA backed by
          GOAPI.
        </p>
        <p class="flex gap-2">
          <ShieldCheck class="mt-0.5 size-4 shrink-0 text-primary" />Secure cookie sessions and
          community moderation.
        </p>
        <p class="flex gap-2">
          <Code2 class="mt-0.5 size-4 shrink-0 text-primary" />Open source, focused, and easy to
          host.
        </p>
        <Button as-child variant="outline" class="w-full"
          ><RouterLink to="/about">Learn about TSBOARD</RouterLink></Button
        ></CardContent
      ></Card
    >
    <div class="px-2 text-xs text-muted-foreground">
      <RouterLink to="/terms" class="hover:underline">Terms</RouterLink><span class="px-2">·</span
      ><RouterLink to="/privacy" class="hover:underline">Privacy</RouterLink
      ><span class="px-2">·</span>v{{ TSBOARD.version }}
    </div>
  </div>
</template>
