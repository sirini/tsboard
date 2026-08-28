<script setup lang="ts">
import { KeyRound } from "lucide-vue-next"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { toast } from "vue-sonner"
import { authApi } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const route = useRoute()
const router = useRouter()
const password = ref("")
const confirm = ref("")
const loading = ref(false)
const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9\s])[^\s]{8,}$/
const submit = async () => {
  if (!pattern.test(password.value))
    return toast.error("Use at least 8 characters with a letter, number, and symbol.")
  if (password.value !== confirm.value) return toast.error("Passwords do not match.")
  loading.value = true
  try {
    const response = await authApi.changePassword({
      target: Number(route.params.target),
      code: String(route.params.code),
      password: password.value,
    })
    if (!response.success || !response.result)
      return toast.error(
        response.success ? "The reset link is invalid or expired." : response.error,
      )
    toast.success("Password changed. You can sign in now.")
    await router.push("/auth/login")
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="mx-auto max-w-md py-10 sm:py-16">
    <Card
      ><CardHeader
        ><CardTitle>Choose a new password</CardTitle
        ><CardDescription
          >Use a password you do not use on another service.</CardDescription
        ></CardHeader
      ><CardContent
        ><form class="space-y-4" @submit.prevent="submit">
          <div class="space-y-2">
            <Label for="new-password">New password</Label
            ><Input
              id="new-password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="confirm-password">Confirm password</Label
            ><Input
              id="confirm-password"
              v-model="confirm"
              type="password"
              autocomplete="new-password"
              required
            />
          </div>
          <Button class="w-full" type="submit" :disabled="loading"
            ><KeyRound />{{ loading ? "Saving…" : "Change password" }}</Button
          >
        </form></CardContent
      ></Card
    >
  </div>
</template>
