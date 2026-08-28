<script setup lang="ts">
import { Mail } from "lucide-vue-next"
import { ref } from "vue"
import { toast } from "vue-sonner"
import { authApi } from "@/api/auth"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const email = ref("")
const sent = ref(false)
const loading = ref(false)
const submit = async () => {
  loading.value = true
  try {
    const response = await authApi.requestReset(email.value.trim())
    if (!response.success) return toast.error(response.error)
    sent.value = true
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="mx-auto max-w-md py-10 sm:py-16">
    <Card
      ><CardHeader
        ><CardTitle>Reset your password</CardTitle
        ><CardDescription
          >We will send a secure reset link to your registered email.</CardDescription
        ></CardHeader
      ><CardContent
        ><Alert v-if="sent" variant="success" title="Check your inbox"
          >If the address is registered, a password reset message is on its way.</Alert
        >
        <form v-else class="space-y-4" @submit.prevent="submit">
          <div class="space-y-2">
            <Label for="reset-email">Email</Label
            ><Input id="reset-email" v-model="email" type="email" autocomplete="email" required />
          </div>
          <Button type="submit" class="w-full" :disabled="loading"
            ><Mail />{{ loading ? "Sending…" : "Send reset link" }}</Button
          >
        </form></CardContent
      ></Card
    >
  </div>
</template>
