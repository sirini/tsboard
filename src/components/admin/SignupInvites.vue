<script setup lang="ts">
import { Copy, Plus, Trash2 } from "lucide-vue-next"
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { toast } from "vue-sonner"
import { authApi, inviteApi } from "@/api/auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDate } from "@/lib/utils"
import type { SignupInvite, SignupStatus } from "@/types/user"

const status = ref<SignupStatus | null>(null)
const { t } = useI18n()
const invites = ref<SignupInvite[]>([])
const email = ref("")
const expiresDays = ref(7)
const createdUrl = ref("")
const busy = ref(false)

const load = async () => {
  const response = await authApi.signupStatus()
  if (response.success) status.value = response.result
  if (status.value?.mode !== "invite_only") return
  const list = await inviteApi.list()
  if (list.success) invites.value = list.result
}
const create = async () => {
  busy.value = true
  try {
    const response = await inviteApi.create(email.value.trim(), Number(expiresDays.value))
    if (!response.success) return toast.error(response.error)
    createdUrl.value = response.result.url
    email.value = ""
    toast.success(t("admin.inviteCreated"))
    await load()
  } finally {
    busy.value = false
  }
}
const revoke = async (uid: number) => {
  const response = await inviteApi.revoke(uid)
  if (!response.success) return toast.error(response.error)
  toast.success(t("admin.inviteRevoked"))
  await load()
}
const copy = async () => {
  await navigator.clipboard.writeText(createdUrl.value)
  toast.success(t("admin.inviteCopied"))
}
onMounted(load)
</script>
<template>
  <Card
    ><CardHeader
      ><CardTitle>{{ $t("admin.signupInvitations") }}</CardTitle
      ><CardDescription
        >{{ $t("admin.currentPolicy") }}:
        <Badge variant="outline">{{ status?.mode ?? "loading" }}</Badge></CardDescription
      ></CardHeader
    ><CardContent
      ><p v-if="status?.mode !== 'invite_only'" class="text-sm text-muted-foreground">
        {{ $t("admin.inviteOnlyHelp") }}
      </p>
      <div v-else class="space-y-5">
        <form class="grid gap-3 sm:grid-cols-[1fr_110px_auto]" @submit.prevent="create">
          <div class="space-y-2">
            <Label for="invite-email">{{ $t("common.email") }}</Label
            ><Input id="invite-email" v-model="email" type="email" required />
          </div>
          <div class="space-y-2">
            <Label for="invite-days">{{ $t("admin.validDays") }}</Label
            ><Input id="invite-days" v-model="expiresDays" type="number" min="1" max="90" />
          </div>
          <Button class="self-end" :disabled="busy"><Plus />{{ $t("admin.create") }}</Button>
        </form>
        <div
          v-if="createdUrl"
          class="flex gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3"
        >
          <Input :model-value="createdUrl" readonly /><Button
            variant="outline"
            size="icon"
            @click="copy"
            ><Copy
          /></Button>
        </div>
        <div class="divide-y rounded-lg border">
          <div
            v-for="invite in invites"
            :key="invite.uid"
            class="flex flex-wrap items-center gap-3 p-3 text-sm"
          >
            <div class="min-w-0 flex-1">
              <p class="truncate font-medium">{{ invite.email }}</p>
              <p class="text-xs text-muted-foreground">
                {{
                  $t("admin.createdExpires", {
                    created: formatDate(invite.created, true),
                    expires: formatDate(invite.expires, true),
                  })
                }}
              </p>
            </div>
            <Badge
              :variant="invite.revoked ? 'destructive' : invite.used ? 'secondary' : 'outline'"
              >{{
                invite.revoked
                  ? $t("admin.revoked")
                  : invite.used
                    ? $t("admin.used")
                    : $t("admin.active")
              }}</Badge
            ><Button
              v-if="!invite.revoked && !invite.used"
              variant="ghost"
              size="icon-sm"
              class="text-destructive"
              @click="revoke(invite.uid)"
              ><Trash2
            /></Button>
          </div>
          <p v-if="!invites.length" class="p-6 text-center text-sm text-muted-foreground">
            {{ $t("admin.noInvitations") }}
          </p>
        </div>
      </div></CardContent
    ></Card
  >
</template>
