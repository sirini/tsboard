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
        ><CardTitle class="text-2xl">Welcome back</CardTitle
        ><CardDescription
          >Sign in to vote, post, and join conversations.</CardDescription
        ></CardHeader
      ><CardContent class="space-y-5"
        ><Alert v-if="route.query.expired" title="Your session expired"
          >Sign in again. Any unfinished post saved in this browser is still available.</Alert
        >
        <form class="space-y-4" @submit.prevent="submit">
          <div class="space-y-2">
            <Label for="email">Email</Label
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
              <Label for="password">Password</Label
              ><RouterLink to="/auth/reset-password" class="text-xs text-primary hover:underline"
                >Forgot password?</RouterLink
              >
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
            ><LogIn />{{ auth.loading ? "Signing in…" : "Sign in" }}</Button
          >
        </form>
        <div class="flex items-center gap-3">
          <Separator /><span class="text-xs uppercase text-muted-foreground">or</span><Separator />
        </div>
        <div class="grid gap-2">
          <Button v-if="TSBOARD.oauth.google" variant="outline" @click="oauth('google')"
            ><span class="font-bold text-blue-600">G</span>Continue with Google</Button
          ><Button v-if="TSBOARD.oauth.naver" variant="outline" @click="oauth('naver')"
            ><span class="font-bold text-green-600">N</span>Continue with Naver</Button
          ><Button v-if="TSBOARD.oauth.kakao" variant="outline" @click="oauth('kakao')"
            ><span class="font-bold text-yellow-500">K</span>Continue with Kakao</Button
          >
        </div>
        <p class="text-center text-sm text-muted-foreground">
          New here?
          <RouterLink to="/auth/join" class="font-medium text-primary hover:underline"
            >Create an account</RouterLink
          >
        </p></CardContent
      ></Card
    >
  </div>
</template>
