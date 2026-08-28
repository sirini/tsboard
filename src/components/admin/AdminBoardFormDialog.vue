<script setup lang="ts">
import { Search } from "lucide-vue-next"
import { reactive, ref, watch } from "vue"
import { toast } from "vue-sonner"
import { boardAdminApi } from "@/api/admin"
import { Button } from "@/components/ui/button"
import { CheckboxField } from "@/components/ui/checkbox"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectField } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import type { AdminBoardInput, AdminGroup } from "@/types/admin"
import { BOARD, type BoardType } from "@/types/board"
import type { BoardWriter } from "@/types/board"

const props = defineProps<{ boardId?: string; groups: AdminGroup[] }>()
const emit = defineEmits<{ saved: [] }>()
const open = defineModel<boolean>({ required: true })
const loading = ref(false)
const candidateName = ref("")
const candidates = ref<BoardWriter[]>([])
const boardUid = ref(0)
const form = reactive<AdminBoardInput>({
  adminUid: 1,
  categories: "",
  groupUid: 0,
  id: "",
  info: "",
  levelComment: 1,
  levelDownload: 0,
  levelList: 0,
  levelView: 0,
  levelWrite: 1,
  name: "",
  pointComment: 0,
  pointDownload: 0,
  pointView: 0,
  pointWrite: 0,
  rowCount: 20,
  type: BOARD.DEFAULT,
  useCategory: false,
  width: 1000,
  skinKey: "nubo-basic-board",
})

const reset = () => {
  Object.assign(form, {
    adminUid: 1,
    categories: "",
    groupUid: props.groups[0]?.uid ?? 0,
    id: "",
    info: "",
    levelComment: 1,
    levelDownload: 0,
    levelList: 0,
    levelView: 0,
    levelWrite: 1,
    name: "",
    pointComment: 0,
    pointDownload: 0,
    pointView: 0,
    pointWrite: 0,
    rowCount: 20,
    type: BOARD.DEFAULT,
    useCategory: false,
    width: 1000,
    skinKey: "nubo-basic-board",
  })
  boardUid.value = 0
  candidates.value = []
}

const load = async () => {
  reset()
  if (!props.boardId) return
  loading.value = true
  try {
    const response = await boardAdminApi.detail(props.boardId)
    if (!response.success) return toast.error(response.error)
    const config = response.result.config
    boardUid.value = config.uid
    Object.assign(form, {
      adminUid: config.admin.board,
      categories: config.category.map((item) => item.name).join(","),
      groupUid: config.groupUid,
      id: config.id,
      info: config.info,
      levelComment: config.level.comment,
      levelDownload: config.level.download,
      levelList: config.level.list,
      levelView: config.level.view,
      levelWrite: config.level.write,
      name: config.name,
      pointComment: config.point.comment,
      pointDownload: config.point.download,
      pointView: config.point.view,
      pointWrite: config.point.write,
      rowCount: config.rowCount,
      type: config.type,
      useCategory: config.useCategory,
      width: config.width,
      skinKey: config.type === BOARD.TRADE ? "nubo-basic-trade" : "nubo-basic-board",
    })
  } finally {
    loading.value = false
  }
}

const searchCandidates = async () => {
  const response = await boardAdminApi.candidates(candidateName.value.trim())
  if (response.success) candidates.value = response.result
  else toast.error(response.error)
}

const numbers = (input: AdminBoardInput): AdminBoardInput => ({
  ...input,
  adminUid: Number(input.adminUid),
  groupUid: Number(input.groupUid),
  rowCount: Number(input.rowCount),
  width: Number(input.width),
  type: Number(input.type) as BoardType,
  levelList: Number(input.levelList),
  levelView: Number(input.levelView),
  levelWrite: Number(input.levelWrite),
  levelComment: Number(input.levelComment),
  levelDownload: Number(input.levelDownload),
  pointView: Number(input.pointView),
  pointWrite: Number(input.pointWrite),
  pointComment: Number(input.pointComment),
  pointDownload: Number(input.pointDownload),
  skinKey: Number(input.type) === BOARD.TRADE ? "nubo-basic-trade" : "nubo-basic-board",
})

const submit = async () => {
  loading.value = true
  try {
    const input = numbers(form)
    const response = boardUid.value
      ? await boardAdminApi.modify({ ...input, boardUid: boardUid.value })
      : await boardAdminApi.create(input)
    if (!response.success) return toast.error(response.error)
    toast.success(boardUid.value ? "Community updated." : "Community created.")
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
    :title="boardUid ? 'Edit community' : 'Create community'"
    description="TSBOARD uses one fixed interface; board type controls content behavior."
    width="xl"
  >
    <form class="space-y-6" @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-2">
          <Label>Group</Label
          ><SelectField v-model="form.groupUid"
            ><option v-for="group in groups" :key="group.uid" :value="group.uid">
              {{ group.id }}
            </option></SelectField
          >
        </div>
        <div class="space-y-2">
          <Label>Type</Label
          ><SelectField v-model="form.type"
            ><option :value="BOARD.DEFAULT">Board</option>
            <option :value="BOARD.GALLERY">Gallery</option>
            <option :value="BOARD.BLOG">Blog</option>
            <option :value="BOARD.WEBZINE">Webzine</option>
            <option :value="BOARD.TRADE">Marketplace</option></SelectField
          >
        </div>
        <div class="space-y-2">
          <Label for="board-id">ID</Label
          ><Input
            id="board-id"
            v-model="form.id"
            :disabled="Boolean(boardUid)"
            pattern="[a-z0-9_]+"
            required
            placeholder="photography"
          />
        </div>
        <div class="space-y-2">
          <Label for="board-name">Name</Label
          ><Input id="board-name" v-model="form.name" required placeholder="Photography" />
        </div>
        <div class="space-y-2 sm:col-span-2">
          <Label for="board-info">Description</Label
          ><Textarea
            id="board-info"
            v-model="form.info"
            placeholder="What belongs in this community?"
          />
        </div>
        <div class="space-y-2">
          <Label for="rows">Posts per page</Label
          ><Input id="rows" v-model="form.rowCount" type="number" min="1" max="100" />
        </div>
        <div class="space-y-2">
          <Label for="width">Content width</Label
          ><Input id="width" v-model="form.width" type="number" min="640" max="2000" />
        </div>
      </div>
      <div class="space-y-3">
        <Label>Community administrator</Label>
        <div class="flex gap-2">
          <Input
            v-model="candidateName"
            placeholder="Search display name"
            @keydown.enter.prevent="searchCandidates"
          /><Button type="button" variant="secondary" @click="searchCandidates"
            ><Search />Search</Button
          >
        </div>
        <div v-if="candidates.length" class="flex flex-wrap gap-2">
          <Button
            v-for="candidate in candidates"
            :key="candidate.uid"
            type="button"
            :variant="form.adminUid === candidate.uid ? 'secondary' : 'outline'"
            size="sm"
            @click="form.adminUid = candidate.uid"
            >{{ candidate.name }} · #{{ candidate.uid }}</Button
          >
        </div>
        <p class="text-xs text-muted-foreground">Selected user UID: {{ form.adminUid }}</p>
      </div>
      <div class="space-y-3">
        <CheckboxField v-model="form.useCategory" label="Use categories" />
        <div v-if="form.useCategory" class="space-y-2">
          <Label for="categories">Categories</Label
          ><Input id="categories" v-model="form.categories" placeholder="General,Question,Guide" />
          <p class="text-xs text-muted-foreground">Separate category names with commas.</p>
        </div>
      </div>
      <Separator />
      <div>
        <h3 class="font-semibold">Level requirements</h3>
        <p class="mb-4 text-sm text-muted-foreground">
          Level 0 allows guests. Writing and comments should normally require level 1.
        </p>
        <div class="grid gap-4 sm:grid-cols-5">
          <div
            v-for="field in [
              'levelList',
              'levelView',
              'levelWrite',
              'levelComment',
              'levelDownload',
            ] as const"
            :key="field"
            class="space-y-2"
          >
            <Label>{{ field.replace("level", "") }}</Label
            ><Input v-model="form[field]" type="number" min="0" max="10" />
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <h3 class="font-semibold">Point policy</h3>
        <p class="mb-4 text-sm text-muted-foreground">
          Negative values charge points; positive values award them.
        </p>
        <div class="grid gap-4 sm:grid-cols-4">
          <div
            v-for="field in ['pointView', 'pointWrite', 'pointComment', 'pointDownload'] as const"
            :key="field"
            class="space-y-2"
          >
            <Label>{{ field.replace("point", "") }}</Label
            ><Input v-model="form[field]" type="number" />
          </div>
        </div>
      </div>
    </form>
    <template #footer
      ><Button variant="ghost" @click="open = false">Cancel</Button
      ><Button :disabled="loading" @click="submit">{{
        loading ? "Saving…" : boardUid ? "Save changes" : "Create community"
      }}</Button></template
    >
  </Dialog>
</template>
