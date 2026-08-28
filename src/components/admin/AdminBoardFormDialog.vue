<script setup lang="ts">
import { Search } from "lucide-vue-next"
import { computed, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
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
const { t, tm } = useI18n()
const emit = defineEmits<{ saved: [] }>()
const open = defineModel<boolean>({ required: true })
const loading = ref(false)
const candidateName = ref("")
const candidates = ref<BoardWriter[]>([])
const boardUid = ref(0)
const boardTypes = computed(() => tm("admin.boardTypes") as string[])
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
    toast.success(boardUid.value ? t("admin.communityUpdated") : t("admin.communityCreated"))
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
    :title="boardUid ? $t('admin.editCommunity') : $t('admin.createCommunity')"
    :description="$t('admin.communityFormDescription')"
    width="xl"
  >
    <form class="space-y-6" @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-2">
          <Label>{{ $t("admin.group") }}</Label
          ><SelectField v-model="form.groupUid"
            ><option v-for="group in groups" :key="group.uid" :value="group.uid">
              {{ group.id }}
            </option></SelectField
          >
        </div>
        <div class="space-y-2">
          <Label>{{ $t("admin.type") }}</Label
          ><SelectField v-model="form.type"
            ><option
              v-for="(label, index) in boardTypes"
              :key="label"
              :value="[BOARD.DEFAULT, BOARD.GALLERY, BOARD.BLOG, BOARD.WEBZINE, BOARD.TRADE][index]"
            >
              {{ label }}
            </option></SelectField
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
          <Label for="board-name">{{ $t("common.name") }}</Label
          ><Input id="board-name" v-model="form.name" required placeholder="Photography" />
        </div>
        <div class="space-y-2 sm:col-span-2">
          <Label for="board-info">{{ $t("admin.description") }}</Label
          ><Textarea
            id="board-info"
            v-model="form.info"
            :placeholder="$t('admin.descriptionPlaceholder')"
          />
        </div>
        <div class="space-y-2">
          <Label for="rows">{{ $t("admin.postsPerPage") }}</Label
          ><Input id="rows" v-model="form.rowCount" type="number" min="1" max="100" />
        </div>
        <div class="space-y-2">
          <Label for="width">{{ $t("admin.contentWidth") }}</Label
          ><Input id="width" v-model="form.width" type="number" min="640" max="2000" />
        </div>
      </div>
      <div class="space-y-3">
        <Label>{{ $t("admin.communityAdmin") }}</Label>
        <div class="flex gap-2">
          <Input
            v-model="candidateName"
            :placeholder="$t('admin.searchMember')"
            @keydown.enter.prevent="searchCandidates"
          /><Button type="button" variant="secondary" @click="searchCandidates"
            ><Search />{{ $t("common.search") }}</Button
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
        <p class="text-xs text-muted-foreground">
          {{ $t("admin.selectedUid", { uid: form.adminUid }) }}
        </p>
      </div>
      <div class="space-y-3">
        <CheckboxField v-model="form.useCategory" :label="$t('admin.useCategories')" />
        <div v-if="form.useCategory" class="space-y-2">
          <Label for="categories">{{ $t("admin.categories") }}</Label
          ><Input id="categories" v-model="form.categories" placeholder="General,Question,Guide" />
          <p class="text-xs text-muted-foreground">{{ $t("admin.categoriesHelp") }}</p>
        </div>
      </div>
      <Separator />
      <div>
        <h3 class="font-semibold">{{ $t("admin.levelRequirements") }}</h3>
        <p class="mb-4 text-sm text-muted-foreground">
          {{ $t("admin.levelHelp") }}
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
            <Label>{{ $t(`admin.policyFields.${field.replace("level", "")}`) }}</Label
            ><Input v-model="form[field]" type="number" min="0" max="10" />
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <h3 class="font-semibold">{{ $t("admin.pointPolicy") }}</h3>
        <p class="mb-4 text-sm text-muted-foreground">
          {{ $t("admin.pointHelp") }}
        </p>
        <div class="grid gap-4 sm:grid-cols-4">
          <div
            v-for="field in ['pointView', 'pointWrite', 'pointComment', 'pointDownload'] as const"
            :key="field"
            class="space-y-2"
          >
            <Label>{{ $t(`admin.policyFields.${field.replace("point", "")}`) }}</Label
            ><Input v-model="form[field]" type="number" />
          </div>
        </div>
      </div>
    </form>
    <template #footer
      ><Button variant="ghost" @click="open = false">{{ $t("common.cancel") }}</Button
      ><Button :disabled="loading" @click="submit">{{
        loading
          ? $t("auth.saving")
          : boardUid
            ? $t("editor.saveChanges")
            : $t("admin.createCommunity")
      }}</Button></template
    >
  </Dialog>
</template>
