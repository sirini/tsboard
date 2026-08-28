<script setup lang="ts">
import { ref, watch } from "vue"
import { toast } from "vue-sonner"
import { authApi } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { CheckboxField } from "@/components/ui/checkbox"
import { Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const props = defineProps<{ userUid: number; userName: string }>()
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
  toast.success("Report sent to the moderation team.")
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
    :title="`Report ${userName}`"
    description="Reports are reviewed by site administrators."
    width="sm"
    ><div v-if="alreadyReported" class="mb-4 rounded-md bg-muted p-3 text-sm text-muted-foreground">
      You have already reported this member. You may update your block preference separately.
    </div>
    <div class="space-y-4">
      <div class="space-y-2">
        <Label for="report-reason">What happened?</Label
        ><Textarea
          id="report-reason"
          v-model="content"
          required
          placeholder="Provide enough context for a moderator."
        />
      </div>
      <CheckboxField v-model="blocked" :label="`Also hide content from ${userName}`" />
    </div>
    <template #footer
      ><Button variant="ghost" @click="open = false">Cancel</Button
      ><Button variant="destructive" :disabled="!content.trim()" @click="submit"
        >Send report</Button
      ></template
    ></Dialog
  >
</template>
