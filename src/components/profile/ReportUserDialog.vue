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

const props = defineProps<{ userUid: number; userName: string }>()
const { t } = useI18n()
const emit = defineEmits<{ reported: [blocked: boolean] }>()
const open = defineModel<boolean>({ required: true })
const content = ref("")
const blocked = ref(false)
const alreadyReported = ref(false)
const load = async () => {
  const response = await authApi.reportStatus(props.userUid)
  if (response.success) {
    alreadyReported.value = response.result.isReported
    blocked.value = response.result.isBannedByMe
  }
}
const submit = async () => {
  const response = await authApi.report(props.userUid, content.value.trim(), blocked.value)
  if (!response.success) return toast.error(response.error)
  toast.success(t("profile.reportSent"))
  emit("reported", blocked.value)
  open.value = false
}
watch(open, (value) => {
  if (value) void load()
})
</script>
<template>
  <Dialog
    v-model="open"
    :title="$t('profile.reportTitle', { name: userName })"
    :description="$t('profile.reportDescription')"
    width="sm"
    ><div v-if="alreadyReported" class="mb-4 rounded-md bg-muted p-3 text-sm text-muted-foreground">
      {{ $t("profile.alreadyReported") }}
    </div>
    <div class="space-y-4">
      <div class="space-y-2">
        <Label for="report-reason">{{ $t("profile.whatHappened") }}</Label
        ><Textarea
          id="report-reason"
          v-model="content"
          required
          :placeholder="$t('profile.reportPlaceholder')"
        />
      </div>
      <CheckboxField v-model="blocked" :label="$t('profile.alsoBlock', { name: userName })" />
    </div>
    <template #footer
      ><Button variant="ghost" @click="open = false">{{ $t("common.cancel") }}</Button
      ><Button variant="destructive" :disabled="!content.trim()" @click="submit">{{
        $t("profile.sendReport")
      }}</Button></template
    ></Dialog
  >
</template>
