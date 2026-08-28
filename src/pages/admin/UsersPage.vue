<script setup lang="ts">
import { Edit, KeyRound, Plus, Search, Trash2 } from "lucide-vue-next"
import { onMounted, ref } from "vue"
import { toast } from "vue-sonner"
import { userAdminApi } from "@/api/admin"
import AdminPermissionDialog from "@/components/admin/AdminPermissionDialog.vue"
import AdminUserFormDialog from "@/components/admin/AdminUserFormDialog.vue"
import SignupInvites from "@/components/admin/SignupInvites.vue"
import PageHeader from "@/components/common/PageHeader.vue"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckboxField } from "@/components/ui/checkbox"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PaginationBar } from "@/components/ui/pagination"
import { SelectField } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { SEARCH, type Search as SearchType } from "@/types/common"
import type { AdminUser } from "@/types/admin"

const users = ref<AdminUser[]>([])
const total = ref(0)
const page = ref(1)
const limit = 20
const option = ref<SearchType>(SEARCH.USER_NAME)
const keyword = ref("")
const isBlocked = ref(false)
const loading = ref(true)
const formOpen = ref(false)
const permissionOpen = ref(false)
const removeOpen = ref(false)
const selected = ref<AdminUser | null>(null)

const load = async () => {
  loading.value = true
  try {
    const response = await userAdminApi.list({
      page: page.value,
      limit,
      option: option.value,
      keyword: keyword.value.trim(),
      isBlocked: isBlocked.value,
    })
    if (!response.success) return toast.error(response.error)
    users.value = response.result.item
    total.value = response.result.total
  } finally {
    loading.value = false
  }
}

const search = () => {
  page.value = 1
  void load()
}
const createUser = () => {
  selected.value = null
  formOpen.value = true
}
const editUser = (user: AdminUser) => {
  selected.value = user
  formOpen.value = true
}
const permissions = (user: AdminUser) => {
  selected.value = user
  permissionOpen.value = true
}
const askRemove = (user: AdminUser) => {
  selected.value = user
  removeOpen.value = true
}
const remove = async () => {
  if (!selected.value) return
  const response = await userAdminApi.remove(selected.value.uid)
  if (!response.success) return toast.error(response.error)
  removeOpen.value = false
  toast.success("User removed.")
  await load()
}
const changePage = (value: number) => {
  page.value = value
  void load()
}
onMounted(load)
</script>

<template>
  <PageHeader
    eyebrow="Administration"
    title="Users"
    description="Create accounts, update profiles, and apply precise capability restrictions."
    ><Button @click="createUser"><Plus />Create user</Button></PageHeader
  >
  <Card class="mb-5"
    ><CardContent class="p-3"
      ><form class="flex flex-col gap-2 sm:flex-row" @submit.prevent="search">
        <SelectField v-model="option" class="sm:w-36"
          ><option :value="SEARCH.USER_NAME">Name</option>
          <option :value="SEARCH.USER_ID">Email</option>
          <option :value="SEARCH.USER_LEVEL">Level</option></SelectField
        >
        <div class="relative flex-1">
          <Search
            class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          /><Input v-model="keyword" class="pl-9" placeholder="Search users" />
        </div>
        <CheckboxField v-model="isBlocked" class="self-center" label="Blocked only" /><Button
          type="submit"
          variant="secondary"
          >Search</Button
        >
      </form></CardContent
    ></Card
  >
  <Card
    ><CardContent class="p-0"
      ><div v-if="loading" class="py-20 text-center"><Spinner label="Loading users" /></div>
      <Table v-else
        ><TableHeader
          ><TableRow
            ><TableHead>User</TableHead><TableHead>Level</TableHead><TableHead>Points</TableHead
            ><TableHead>Joined</TableHead
            ><TableHead class="text-right">Actions</TableHead></TableRow
          ></TableHeader
        ><TableBody
          ><TableRow v-for="user in users" :key="user.uid"
            ><TableCell
              ><div class="flex items-center gap-3">
                <Avatar :src="user.profile" :alt="user.name" />
                <div class="min-w-0">
                  <RouterLink
                    :to="`/user/${user.uid}`"
                    class="block truncate font-medium hover:text-primary"
                    >{{ user.name }}</RouterLink
                  >
                  <p class="truncate text-xs text-muted-foreground">{{ user.id }}</p>
                </div>
              </div></TableCell
            ><TableCell
              ><Badge variant="outline">Lv. {{ user.level }}</Badge></TableCell
            ><TableCell>{{ user.point }}</TableCell
            ><TableCell class="whitespace-nowrap text-muted-foreground">{{
              formatDate(user.signup)
            }}</TableCell
            ><TableCell
              ><div class="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Permissions"
                  @click="permissions(user)"
                  ><KeyRound /></Button
                ><Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Edit user"
                  @click="editUser(user)"
                  ><Edit /></Button
                ><Button
                  variant="ghost"
                  size="icon-sm"
                  class="text-destructive"
                  aria-label="Remove user"
                  @click="askRemove(user)"
                  ><Trash2
                /></Button></div></TableCell></TableRow></TableBody
      ></Table>
      <div v-if="!loading && !users.length" class="py-14 text-center text-sm text-muted-foreground">
        No users match this filter.
      </div>
      <div class="border-t p-4">
        <PaginationBar
          :page="page"
          :total="total"
          :page-size="limit"
          @change="changePage"
        /></div></CardContent
  ></Card>
  <div class="mt-5"><SignupInvites /></div>
  <AdminUserFormDialog v-model="formOpen" :user-uid="selected?.uid" @saved="load" />
  <AdminPermissionDialog
    v-if="selected"
    v-model="permissionOpen"
    :user-uid="selected.uid"
    :user-name="selected.name"
  />
  <Dialog
    v-model="removeOpen"
    :title="`Remove ${selected?.name ?? 'user'}?`"
    description="The account and connected data will be permanently removed."
    width="sm"
    ><template #footer
      ><Button variant="ghost" @click="removeOpen = false">Cancel</Button
      ><Button variant="destructive" @click="remove">Remove user</Button></template
    ></Dialog
  >
</template>
