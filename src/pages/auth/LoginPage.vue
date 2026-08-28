<script setup lang="ts">
import { LogIn } from "lucide-vue-next"
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/stores/auth"
import { TSBOARD } from "../../../tsboard.config"

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const email = ref("")
const password = ref("")
const redirect = computed(() => {
  const value = String(route.query.redirect ?? "/")
  return value.startsWith("/") && !value.startsWith("//") ? value : "/"
})

const submit = async () => {
  if (await auth.login(email.value.trim(), password.value)) await router.push(redirect.value)
}
const oauth = (provider: "google" | "naver" | "kakao") => {
  window.location.assign(`${TSBOARD.apiBase}/auth/${provider}/request`)
}
</script>

<template>
  <div class="mx-auto max-w-md py-8 sm:py-16">
    <Card
      ><CardHeader
        ><CardTitle class="text-2xl">{{ $t("auth.welcomeBack") }}</CardTitle
        ><CardDescription>{{ $t("auth.signInDescription") }}</CardDescription></CardHeader
      ><CardContent class="space-y-5"
        ><Alert v-if="route.query.expired" :title="$t('auth.sessionExpired')">{{
          $t("auth.sessionExpiredDescription")
        }}</Alert>
        <form class="space-y-4" @submit.prevent="submit">
          <div class="space-y-2">
            <Label for="email">{{ $t("common.email") }}</Label
            ><Input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              placeholder="you@example.com"
            />
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <Label for="password">{{ $t("common.password") }}</Label
              ><RouterLink to="/auth/reset-password" class="text-xs text-primary hover:underline">{{
                $t("auth.forgotPassword")
              }}</RouterLink>
            </div>
            <Input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
            />
          </div>
          <Button type="submit" class="w-full" :disabled="auth.loading"
            ><LogIn />{{ auth.loading ? $t("auth.signingIn") : $t("navigation.signIn") }}</Button
          >
        </form>
        <div class="flex items-center gap-3">
          <Separator /><span class="font-label text-xs uppercase text-muted-foreground">{{
            $t("auth.or")
          }}</span
          ><Separator />
        </div>
        <div class="grid gap-2">
          <Button v-if="TSBOARD.oauth.google" variant="outline" @click="oauth('google')"
            ><span class="font-bold text-blue-600">G</span>{{ $t("auth.google") }}</Button
          ><Button v-if="TSBOARD.oauth.naver" variant="outline" @click="oauth('naver')"
            ><span class="font-bold text-green-600">N</span>{{ $t("auth.naver") }}</Button
          ><Button v-if="TSBOARD.oauth.kakao" variant="outline" @click="oauth('kakao')"
            ><span class="font-bold text-yellow-500">K</span>{{ $t("auth.kakao") }}</Button
          >
        </div>
        <p class="text-center text-sm text-muted-foreground">
          {{ $t("auth.newHere") }}
          <RouterLink to="/auth/join" class="font-medium text-primary hover:underline">{{
            $t("auth.createAccount")
          }}</RouterLink>
        </p></CardContent
      ></Card
    >
  </div>
</template>
