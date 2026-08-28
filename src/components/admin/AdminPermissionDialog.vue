<script setup lang="ts">
import { ref, watch } from "vue"
import { toast } from "vue-sonner"
import { authApi } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { CheckboxField } from "@/components/ui/checkbox"
import { Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { UserPermissionManage } from "@/types/user"

const props = defineProps<{ userUid: number; userName: string }>()
const open = defineModel<boolean>({ required: true })
const loading = ref(false)
const permission = ref<UserPermissionManage>({
  userUid: 0,
  login: true,
  writePost: true,
  writeComment: true,
  sendChatMessage: true,
  sendReport: true,
  response: "",
})
const load = async () => {
  loading.value = true
  try {
    const response = await authApi.permission(props.userUid)
    if (response.success) permission.value = response.result
    else toast.error(response.error)
  } finally {
    loading.value = false
  }
}
const submit = async () => {
  const response = await authApi.updatePermission({ ...permission.value, userUid: props.userUid })
  if (!response.success) return toast.error(response.error)
  toast.success("Permissions updated.")
  open.value = false
}
watch(open, (value) => {
  if (value) void load()
})
</script>
<template>
  <Dialog
    v-model="open"
    :title="`Permissions for ${userName}`"
    description="Turn off only the capabilities required by the moderation decision."
    ><div class="grid gap-4 sm:grid-cols-2">
      <CheckboxField v-model="permission.login" label="Can sign in" /><CheckboxField
        v-model="permission.writePost"
        label="Can write posts"
      /><CheckboxField v-model="permission.writeComment" label="Can write comments" /><CheckboxField
        v-model="permission.sendChatMessage"
        label="Can send messages"
      /><CheckboxField v-model="permission.sendReport" label="Can send reports" />
    </div>
    <div class="mt-5 space-y-2">
      <Label for="permission-response">Moderator note</Label
      ><Textarea
        id="permission-response"
        v-model="permission.response"
        placeholder="Explain the action for the audit trail."
      />
    </div>
    <template #footer
      ><Button variant="ghost" @click="open = false">Cancel</Button
      ><Button :disabled="loading" @click="submit">Save permissions</Button></template
    ></Dialog
  >
</template>
