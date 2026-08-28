<script setup lang="ts">
import { Edit, Plus, Shield, Trash2 } from "lucide-vue-next"
import { onMounted, ref } from "vue"
import { toast } from "vue-sonner"
import { boardAdminApi, groupAdminApi } from "@/api/admin"
import AdminBoardFormDialog from "@/components/admin/AdminBoardFormDialog.vue"
import EmptyState from "@/components/common/EmptyState.vue"
import PageHeader from "@/components/common/PageHeader.vue"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import type { AdminGroup, AdminGroupDetail } from "@/types/admin"
import type { BoardWriter } from "@/types/board"

const groups = ref<AdminGroup[]>([])
const detail = ref<AdminGroupDetail | null>(null)
const loading = ref(true)
const groupDialog = ref(false)
const groupMode = ref<"create" | "rename" | "manager">("create")
const groupValue = ref("")
const managerCandidates = ref<BoardWriter[]>([])
const selectedManager = ref(0)
const boardDialog = ref(false)
const selectedBoardId = ref<string | undefined>()
const removeBoardUid = ref(0)
const removeBoardOpen = ref(false)
const removeGroupOpen = ref(false)

const loadGroups = async (selectId?: string) => {
  loading.value = true
  try {
    const response = await groupAdminApi.list()
    if (!response.success) return toast.error(response.error)
    groups.value = response.result
    const id = selectId ?? detail.value?.config.id ?? groups.value[0]?.id
    if (id) await selectGroup(id)
  } finally {
    loading.value = false
  }
}

const selectGroup = async (id: string) => {
  const response = await groupAdminApi.detail(id)
  if (response.success) detail.value = response.result
  else toast.error(response.error)
}

const openGroupDialog = (mode: "create" | "rename" | "manager") => {
  groupMode.value = mode
  groupValue.value = mode === "rename" ? (detail.value?.config.id ?? "") : ""
  managerCandidates.value = []
  selectedManager.value = detail.value?.config.manager.uid ?? 0
  groupDialog.value = true
}

const searchManagers = async () => {
  const response = await groupAdminApi.candidates(groupValue.value.trim())
  if (response.success) managerCandidates.value = response.result
  else toast.error(response.error)
}

const saveGroup = async () => {
  if (groupMode.value === "manager") {
    if (!detail.value || !selectedManager.value) return
    const response = await groupAdminApi.changeAdmin(detail.value.config.uid, selectedManager.value)
    if (!response.success) return toast.error(response.error)
  } else if (groupMode.value === "rename") {
    if (!detail.value) return
    const response = await groupAdminApi.update(detail.value.config.uid, groupValue.value.trim())
    if (!response.success) return toast.error(response.error)
  } else {
    const response = await groupAdminApi.create(groupValue.value.trim())
    if (!response.success) return toast.error(response.error)
  }
  groupDialog.value = false
  toast.success("Group saved.")
  await loadGroups(
    groupMode.value === "rename" || groupMode.value === "create"
      ? groupValue.value.trim()
      : undefined,
  )
}

const removeGroup = async () => {
  if (!detail.value) return
  const response = await groupAdminApi.remove(detail.value.config.uid)
  if (!response.success) return toast.error(response.error)
  removeGroupOpen.value = false
  detail.value = null
  await loadGroups()
}

const openBoard = (id?: string) => {
  selectedBoardId.value = id
  boardDialog.value = true
}
const askRemoveBoard = (boardUid: number) => {
  removeBoardUid.value = boardUid
  removeBoardOpen.value = true
}
const removeBoard = async () => {
  const response = await boardAdminApi.remove(removeBoardUid.value)
  if (!response.success) return toast.error(response.error)
  removeBoardOpen.value = false
  await loadGroups()
}
onMounted(() => loadGroups())
</script>

<template>
  <PageHeader
    :eyebrow="$t('admin.eyebrow')"
    :title="$t('admin.communities')"
    :description="$t('admin.boardsDescription')"
    ><div class="flex gap-2">
      <Button variant="outline" @click="openGroupDialog('create')"
        ><Plus />{{ $t("admin.newGroup") }}</Button
      ><Button @click="openBoard()"><Plus />{{ $t("admin.newCommunity") }}</Button>
    </div></PageHeader
  >
  <div v-if="loading" class="py-20 text-center">
    <Spinner :label="$t('admin.loadingCommunities')" />
  </div>
  <div v-else class="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
    <Card
      ><CardHeader
        ><CardTitle class="text-sm">{{ $t("admin.groups") }}</CardTitle></CardHeader
      ><CardContent class="space-y-1"
        ><button
          v-for="group in groups"
          :key="group.uid"
          :class="[
            'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-accent',
            detail?.config.uid === group.uid && 'bg-accent font-medium',
          ]"
          @click="selectGroup(group.id)"
        >
          <span class="truncate">{{ group.id }}</span
          ><Badge variant="secondary">{{ group.count }}</Badge>
        </button></CardContent
      ></Card
    >
    <div v-if="detail" class="space-y-4">
      <Card
        ><CardContent class="flex flex-wrap items-center justify-between gap-4 p-5"
          ><div>
            <p class="font-label text-xs uppercase text-muted-foreground">
              {{ $t("admin.group") }}
            </p>
            <h2 class="text-xl font-bold">{{ detail.config.id }}</h2>
            <div class="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar :src="detail.config.manager.profile" class="size-6" />{{
                $t("admin.managedBy", { name: detail.config.manager.name })
              }}
            </div>
          </div>
          <div class="flex gap-2">
            <Button variant="outline" size="sm" @click="openGroupDialog('manager')"
              ><Shield />{{ $t("admin.manager") }}</Button
            ><Button variant="outline" size="sm" @click="openGroupDialog('rename')"
              ><Edit />{{ $t("admin.rename") }}</Button
            ><Button variant="destructive" size="sm" @click="removeGroupOpen = true"
              ><Trash2
            /></Button></div></CardContent></Card
      ><Card
        ><CardHeader
          ><CardTitle>{{ $t("admin.boardsInGroup") }}</CardTitle></CardHeader
        ><CardContent class="space-y-2"
          ><div
            v-for="board in detail.boards"
            :key="board.uid"
            class="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
          >
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-semibold">{{ board.name }}</h3>
                <Badge variant="outline">t/{{ board.id }}</Badge>
              </div>
              <p class="mt-1 text-sm text-muted-foreground">{{ board.info }}</p>
              <p class="mt-2 text-xs text-muted-foreground">
                {{
                  $t("admin.totals", {
                    posts: board.total.post,
                    comments: board.total.comment,
                    images: board.total.image,
                  })
                }}
              </p>
            </div>
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="openBoard(board.id)"
                ><Edit />{{ $t("common.edit") }}</Button
              ><Button
                variant="ghost"
                size="icon-sm"
                class="text-destructive"
                @click="askRemoveBoard(board.uid)"
                ><Trash2
              /></Button>
            </div>
          </div>
          <EmptyState v-if="!detail.boards.length" :title="$t('admin.emptyGroup')" /></CardContent
      ></Card>
    </div>
  </div>
  <AdminBoardFormDialog
    v-model="boardDialog"
    :board-id="selectedBoardId"
    :groups="groups"
    @saved="loadGroups()"
  />
  <Dialog
    v-model="groupDialog"
    :title="
      groupMode === 'create'
        ? $t('admin.createGroup')
        : groupMode === 'rename'
          ? $t('admin.renameGroup')
          : $t('admin.changeGroupManager')
    "
    width="sm"
    ><div v-if="groupMode !== 'manager'" class="space-y-2">
      <Label for="group-value">{{ $t("admin.groupId") }}</Label
      ><Input id="group-value" v-model="groupValue" pattern="[a-z0-9_]+" />
    </div>
    <div v-else class="space-y-3">
      <div class="flex gap-2">
        <Input
          v-model="groupValue"
          :placeholder="$t('admin.searchMember')"
          @keydown.enter.prevent="searchManagers"
        /><Button variant="secondary" @click="searchManagers">{{ $t("common.search") }}</Button>
      </div>
      <button
        v-for="candidate in managerCandidates"
        :key="candidate.uid"
        :class="[
          'flex w-full items-center gap-2 rounded-md border p-2 text-sm',
          selectedManager === candidate.uid && 'border-primary bg-primary/5',
        ]"
        @click="selectedManager = candidate.uid"
      >
        <Avatar :src="candidate.profile" class="size-7" />{{ candidate.name }}
      </button>
    </div>
    <template #footer
      ><Button variant="ghost" @click="groupDialog = false">{{ $t("common.cancel") }}</Button
      ><Button
        :disabled="groupMode === 'manager' ? !selectedManager : !groupValue.trim()"
        @click="saveGroup"
        >{{ $t("common.save") }}</Button
      ></template
    ></Dialog
  >
  <Dialog
    v-model="removeBoardOpen"
    :title="$t('admin.removeCommunityTitle')"
    :description="$t('admin.removeCommunityDescription')"
    width="sm"
    ><template #footer
      ><Button variant="ghost" @click="removeBoardOpen = false">{{ $t("common.cancel") }}</Button
      ><Button variant="destructive" @click="removeBoard">{{
        $t("common.remove")
      }}</Button></template
    ></Dialog
  >
  <Dialog
    v-model="removeGroupOpen"
    :title="$t('admin.removeGroupTitle')"
    :description="$t('admin.removeGroupDescription')"
    width="sm"
    ><template #footer
      ><Button variant="ghost" @click="removeGroupOpen = false">{{ $t("common.cancel") }}</Button
      ><Button variant="destructive" @click="removeGroup">{{
        $t("common.remove")
      }}</Button></template
    ></Dialog
  >
</template>
