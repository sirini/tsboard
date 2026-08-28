<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"

const draftOpen = defineModel<boolean>("draftOpen", { required: true })
const attachmentOpen = defineModel<boolean>("attachmentOpen", { required: true })
defineEmits<{ discard: []; restore: []; removeAttachment: [] }>()
</script>

<template>
  <Dialog
    v-model="draftOpen"
    :title="$t('editor.draftTitle')"
    :description="$t('editor.draftDescription')"
    width="sm"
  >
    <p class="text-sm text-muted-foreground">{{ $t("editor.draftHelp") }}</p>
    <template #footer>
      <Button variant="ghost" @click="$emit('discard')">{{ $t("editor.discard") }}</Button>
      <Button @click="$emit('restore')">{{ $t("editor.restore") }}</Button>
    </template>
  </Dialog>
  <Dialog
    v-model="attachmentOpen"
    :title="$t('editor.removeAttachmentTitle')"
    :description="$t('editor.removeAttachmentDescription')"
    width="sm"
  >
    <template #footer>
      <Button variant="ghost" @click="attachmentOpen = false">{{ $t("common.cancel") }}</Button>
      <Button variant="destructive" @click="$emit('removeAttachment')">
        {{ $t("editor.removeAttachment") }}
      </Button>
    </template>
  </Dialog>
</template>
