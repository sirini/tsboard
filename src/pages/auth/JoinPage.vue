<script setup lang="ts">
import { CheckCircle2, MailCheck, UserPlus } from "lucide-vue-next"
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { toast } from "vue-sonner"
import { authApi } from "@/api/auth"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CODE } from "@/types/common"
import type { SignupStatus } from "@/types/user"

const route = useRoute()
const status = ref<SignupStatus | null>(null)
const loading = ref(false)
const email = ref("")
const name = ref("")
const password = ref("")
const confirmPassword = ref("")
const invite = ref(String(route.query.invite ?? ""))
const target = ref(0)
const code = ref("")
const step = ref<"form" | "verify" | "done">("form")
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9\s])[^\s]{8,}$/

const loadStatus = async () => {
  try {
    const response = await authApi.signupStatus()
    if (response.success) status.value = response.result
  } catch (error) {
    toast.error(`Signup status unavailable: ${String(error)}`)
  }
}

const validate = () => {
  if (!passwordPattern.test(password.value))
    return "Use at least 8 characters with a letter, number, and symbol."
  if (password.value !== confirmPassword.value) return "Passwords do not match."
  if (name.value.trim().length < 2) return "Your display name needs at least 2 characters."
  return ""
}

const submit = async () => {
  const issue = validate()
  if (issue) return toast.error(issue)
  loading.value = true
  try {
    const [emailCheck, nameCheck] = await Promise.all([
      authApi.checkEmail(email.value),
      authApi.checkName(name.value),
    ])
    if (!emailCheck.success || !nameCheck.success)
      return toast.error(emailCheck.success ? nameCheck.error : emailCheck.error)
    if (emailCheck.result) return toast.error("That email is already registered.")
    if (nameCheck.result) return toast.error("That display name is already taken.")
    const response = await authApi.signup({
      id: email.value.trim(),
      password: password.value,
      name: name.value.trim(),
      invite: invite.value.trim() || undefined,
    })
    if (!response.success) return handleSignupError(response.code, response.error)
    target.value = response.result.target
    step.value = response.result.completed ? "done" : "verify"
    if (!response.result.completed) toast.success("Verification email sent.")
  } finally {
    loading.value = false
  }
}

const handleSignupError = (errorCode: number, fallback: string) => {
  const messages: Record<number, string> = {
    [CODE.MAIL_NOT_CONFIGURED]: "Email delivery is not configured. Contact the administrator.",
    [CODE.RATE_LIMITED]: "A verification message was requested recently. Please wait a moment.",
    [CODE.SIGNUP_DISABLED]: "New registrations are currently closed.",
    [CODE.INVALID_INVITE]: "That invitation is invalid, expired, used, or revoked.",
  }
  toast.error(messages[errorCode] ?? fallback)
}

const verify = async () => {
  if (code.value.length !== 6) return toast.error("Enter the 6-character verification code.")
  loading.value = true
  try {
    const response = await authApi.verify({
      id: email.value,
      password: password.value,
      name: name.value,
      target: target.value,
      code: code.value,
    })
    if (!response.success) return toast.error(response.error)
    if (!response.result) return toast.error("The verification code does not match.")
    step.value = "done"
  } finally {
    loading.value = false
  }
}

onMounted(loadStatus)
</script>

<template>
  <div class="mx-auto max-w-lg py-8 sm:py-14">
    <Card
      ><CardHeader
        ><CardTitle class="text-2xl">Join TSBOARD</CardTitle
        ><CardDescription
          >Create one account for every community on this site.</CardDescription
        ></CardHeader
      ><CardContent>
        <Alert
          v-if="status?.mode === 'disabled'"
          variant="destructive"
          title="Registration is closed"
          >Existing members can still sign in.</Alert
        >
        <form v-else-if="step === 'form'" class="space-y-4" @submit.prevent="submit">
          <div v-if="status?.mode === 'invite_only'" class="space-y-2">
            <Label for="invite">Invitation</Label
            ><Input
              id="invite"
              v-model="invite"
              required
              placeholder="Paste your invitation token or URL"
            />
          </div>
          <div class="space-y-2">
            <Label for="join-email">Email</Label
            ><Input id="join-email" v-model="email" type="email" autocomplete="email" required />
          </div>
          <div class="space-y-2">
            <Label for="join-name">Display name</Label
            ><Input id="join-name" v-model="name" autocomplete="nickname" required maxlength="40" />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label for="join-password">Password</Label
              ><Input
                id="join-password"
                v-model="password"
                type="password"
                autocomplete="new-password"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="join-confirm">Confirm password</Label
              ><Input
                id="join-confirm"
                v-model="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
              />
            </div>
          </div>
          <p class="text-xs text-muted-foreground">
            At least 8 characters, including a letter, number, and symbol.
          </p>
          <Button class="w-full" type="submit" :disabled="loading"
            ><UserPlus />{{ loading ? "Creating account…" : "Create account" }}</Button
          >
        </form>
        <form v-else-if="step === 'verify'" class="space-y-5 text-center" @submit.prevent="verify">
          <MailCheck class="mx-auto size-10 text-primary" />
          <div>
            <h2 class="font-semibold">Check your inbox</h2>
            <p class="mt-1 text-sm text-muted-foreground">
              Enter the six-character code sent to {{ email }}.
            </p>
          </div>
          <Input
            v-model="code"
            class="mx-auto max-w-52 text-center font-mono text-xl tracking-[0.4em]"
            maxlength="6"
            autocomplete="one-time-code"
          /><Button type="submit" :disabled="loading">{{
            loading ? "Verifying…" : "Verify email"
          }}</Button>
        </form>
        <div v-else class="space-y-5 py-5 text-center">
          <CheckCircle2 class="mx-auto size-12 text-emerald-600" />
          <div>
            <h2 class="text-lg font-semibold">Your account is ready</h2>
            <p class="mt-1 text-sm text-muted-foreground">Welcome to the community.</p>
          </div>
          <Button as-child><RouterLink to="/auth/login">Continue to sign in</RouterLink></Button>
        </div>
      </CardContent></Card
    >
  </div>
</template>
