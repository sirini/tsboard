<script setup lang="ts">
import { ref, watch } from "vue"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/stores/auth"

const props = defineProps<{ name: string; signature: string }>()
const emit = defineEmits<{ saved: [] }>()
const open = defineModel<boolean>({ required: true })
const auth = useAuthStore()
const displayName = ref("")
const about = ref("")
const password = ref("")
const profile = ref<File | null>(null)
watch(open, (value) => {
  if (value) {
    displayName.value = props.name
    about.value = props.signature
    password.value = ""
    profile.value = null
  }
})
const choose = (event: Event) => {
  profile.value = (event.target as HTMLInputElement).files?.[0] ?? null
}
const submit = async () => {
  if (
    await auth.saveProfile({
      name: displayName.value.trim(),
      signature: about.value.trim(),
      password: password.value,
      profile: profile.value,
    })
  ) {
    open.value = false
    emit("saved")
  }
}
</script>
<template>
  <Dialog v-model="open" title="Edit profile" description="Update how other members see you."
    ><form class="space-y-4" @submit.prevent="submit">
      <div class="space-y-2">
        <Label for="profile-name">Display name</Label
        ><Input id="profile-name" v-model="displayName" required minlength="2" />
      </div>
      <div class="space-y-2">
        <Label for="profile-signature">About</Label
        ><Textarea id="profile-signature" v-model="about" maxlength="500" />
      </div>
      <div class="space-y-2">
        <Label for="profile-photo">Profile photo</Label
        ><Input id="profile-photo" type="file" accept="image/*" @change="choose" />
      </div>
      <div class="space-y-2">
        <Label for="profile-password"
          >New password <span class="font-normal text-muted-foreground">(optional)</span></Label
        ><Input
          id="profile-password"
          v-model="password"
          type="password"
          autocomplete="new-password"
        />
      </div>
    </form>
    <template #footer
      ><Button variant="ghost" @click="open = false">Cancel</Button
      ><Button :disabled="auth.loading" @click="submit">{{
        auth.loading ? "Saving…" : "Save profile"
      }}</Button></template
    ></Dialog
  >
</template>
