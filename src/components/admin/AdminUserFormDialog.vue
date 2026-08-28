<script setup lang="ts">
import { ref, watch } from "vue"
import { toast } from "vue-sonner"
import { userAdminApi } from "@/api/admin"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { AdminUserInput } from "@/types/admin"

const props = defineProps<{ userUid?: number }>()
const emit = defineEmits<{ saved: [] }>()
const open = defineModel<boolean>({ required: true })
const loading = ref(false)
const profile = ref<File | null>(null)
const form = ref<AdminUserInput>({
  id: "",
  name: "",
  password: "",
  profile: null,
  oldProfile: "",
  level: 1,
  point: 0,
  signature: "",
})

const load = async () => {
  form.value = {
    id: "",
    name: "",
    password: "",
    profile: null,
    oldProfile: "",
    level: 1,
    point: 0,
    signature: "",
  }
  profile.value = null
  if (!props.userUid) return
  loading.value = true
  try {
    const response = await userAdminApi.detail(props.userUid)
    if (!response.success) return toast.error(response.error)
    form.value = {
      id: response.result.id,
      name: response.result.name,
      password: "",
      profile: null,
      oldProfile: response.result.profile,
      level: response.result.level,
      point: response.result.point,
      signature: response.result.signature,
    }
  } finally {
    loading.value = false
  }
}

const choose = (event: Event) => {
  profile.value = (event.target as HTMLInputElement).files?.[0] ?? null
}
const submit = async () => {
  loading.value = true
  try {
    const input = {
      ...form.value,
      level: Number(form.value.level),
      point: Number(form.value.point),
      profile: profile.value,
    }
    const response = props.userUid
      ? await userAdminApi.modify({ ...input, userUid: props.userUid })
      : await userAdminApi.create(input)
    if (!response.success) return toast.error(response.error)
    toast.success(props.userUid ? "User updated." : "User created.")
    open.value = false
    emit("saved")
  } finally {
    loading.value = false
  }
}
watch(open, (value) => {
  if (value) void load()
})
</script>
<template>
  <Dialog
    v-model="open"
    :title="userUid ? 'Edit user' : 'Create user'"
    description="Administrative account changes take effect immediately."
    ><form class="grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
      <div class="space-y-2 sm:col-span-2">
        <Label for="user-email">Email</Label
        ><Input
          id="user-email"
          v-model="form.id"
          type="email"
          :disabled="Boolean(userUid)"
          required
        />
      </div>
      <div class="space-y-2">
        <Label for="user-name">Display name</Label
        ><Input id="user-name" v-model="form.name" required minlength="2" />
      </div>
      <div class="space-y-2">
        <Label for="user-password">{{ userUid ? "New password (optional)" : "Password" }}</Label
        ><Input
          id="user-password"
          v-model="form.password"
          type="password"
          :required="!userUid"
          autocomplete="new-password"
        />
      </div>
      <div class="space-y-2">
        <Label for="user-level">Level</Label
        ><Input id="user-level" v-model="form.level" type="number" min="1" max="10" />
      </div>
      <div class="space-y-2">
        <Label for="user-points">Points</Label
        ><Input id="user-points" v-model="form.point" type="number" />
      </div>
      <div class="space-y-2 sm:col-span-2">
        <Label for="user-signature">Bio</Label
        ><Textarea id="user-signature" v-model="form.signature" />
      </div>
      <div class="space-y-2 sm:col-span-2">
        <Label for="user-profile">Profile photo</Label
        ><Input id="user-profile" type="file" accept="image/*" @change="choose" />
      </div>
    </form>
    <template #footer
      ><Button variant="ghost" @click="open = false">Cancel</Button
      ><Button :disabled="loading" @click="submit">{{
        loading ? "Saving…" : "Save user"
      }}</Button></template
    ></Dialog
  >
</template>
