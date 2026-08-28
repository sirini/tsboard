<script setup lang="ts">
import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { toast } from "vue-sonner"
import { authApi } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { CheckboxField } from "@/components/ui/checkbox"
import { Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { UserPermissionManage } from "@/types/user"

const props = defineProps<{ userUid: number; userName: string }>()
const { t } = useI18n()
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
  toast.success(t("admin.permissionsUpdated"))
  open.value = false
}
watch(open, (value) => {
  if (value) void load()
})
</script>
<template>
  <Dialog
    v-model="open"
    :title="$t('admin.permissionTitle', { name: userName })"
    :description="$t('admin.permissionDescription')"
    ><div class="grid gap-4 sm:grid-cols-2">
      <CheckboxField v-model="permission.login" :label="$t('admin.canSignIn')" /><CheckboxField
        v-model="permission.writePost"
        :label="$t('admin.canWritePosts')"
      /><CheckboxField
        v-model="permission.writeComment"
        :label="$t('admin.canWriteComments')"
      /><CheckboxField
        v-model="permission.sendChatMessage"
        :label="$t('admin.canSendMessages')"
      /><CheckboxField v-model="permission.sendReport" :label="$t('admin.canSendReports')" />
    </div>
    <div class="mt-5 space-y-2">
      <Label for="permission-response">{{ $t("admin.moderatorNote") }}</Label
      ><Textarea
        id="permission-response"
        v-model="permission.response"
        :placeholder="$t('admin.moderatorNotePlaceholder')"
      />
    </div>
    <template #footer
      ><Button variant="ghost" @click="open = false">{{ $t("common.cancel") }}</Button
      ><Button :disabled="loading" @click="submit">{{
        $t("admin.savePermissions")
      }}</Button></template
    ></Dialog
  >
</template>
