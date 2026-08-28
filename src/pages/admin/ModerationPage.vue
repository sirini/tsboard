<script setup lang="ts">
import { CheckCircle2, MessageCircle, MessagesSquare, Search, Trash2 } from "lucide-vue-next"
import { computed, onMounted, ref, watch } from "vue"
import { toast } from "vue-sonner"
import { moderationApi } from "@/api/admin"
import EmptyState from "@/components/common/EmptyState.vue"
import PageHeader from "@/components/common/PageHeader.vue"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckboxField } from "@/components/ui/checkbox"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Textarea } from "@/components/ui/textarea"
import { formatDate, stripTags } from "@/lib/utils"
import { SEARCH, type Search as SearchType } from "@/types/common"
import type { AdminLatestComment, AdminLatestPost, AdminReport } from "@/types/admin"

type Tab = "posts" | "comments" | "reports"
const tab = ref<Tab>("posts")
const posts = ref<AdminLatestPost[]>([])
const comments = ref<AdminLatestComment[]>([])
const reports = ref<AdminReport[]>([])
const reportTotal = ref(0)
const page = ref(1)
const limit = 20
const option = ref<SearchType>(SEARCH.TITLE)
const keyword = ref("")
const solved = ref(false)
const loading = ref(true)
const selected = ref<number[]>([])
const removeOpen = ref(false)
const resolveOpen = ref(false)
const selectedReport = ref<AdminReport | null>(null)
const response = ref("")
const rows = computed(() => (tab.value === "posts" ? posts.value : comments.value))

const load = async () => {
  loading.value = true
  selected.value = []
  try {
    const query = { page: page.value, limit, option: option.value, keyword: keyword.value.trim() }
    if (tab.value === "posts") {
      const result = await moderationApi.posts(query)
      if (result.success) posts.value = result.result
      else toast.error(result.error)
    } else if (tab.value === "comments") {
      const result = await moderationApi.comments(query)
      if (result.success) comments.value = result.result
      else toast.error(result.error)
    } else {
      const result = await moderationApi.reports({ ...query, isSolved: solved.value })
      if (result.success) {
        reports.value = result.result.item
        reportTotal.value = result.result.total
      } else toast.error(result.error)
    }
  } finally {
    loading.value = false
  }
}

const select = (uid: number, checked: boolean) => {
  selected.value = checked
    ? [...new Set([...selected.value, uid])]
    : selected.value.filter((item) => item !== uid)
}
const removeSelected = async () => {
  const result =
    tab.value === "posts"
      ? await moderationApi.removePosts(selected.value)
      : await moderationApi.removeComments(selected.value)
  if (!result.success) return toast.error(result.error)
  removeOpen.value = false
  toast.success(`${selected.value.length} items removed.`)
  await load()
}
const openResolve = (report: AdminReport) => {
  selectedReport.value = report
  response.value = report.response
  resolveOpen.value = true
}
const resolve = async () => {
  if (!selectedReport.value) return
  const result = await moderationApi.resolve(selectedReport.value.uid, response.value.trim())
  if (!result.success) return toast.error(result.error)
  resolveOpen.value = false
  toast.success("Report resolved.")
  await load()
}
const search = () => {
  page.value = 1
  void load()
}
const changePage = (value: number) => {
  page.value = value
  void load()
}
watch(tab, () => {
  page.value = 1
  option.value =
    tab.value === "reports"
      ? SEARCH.REPORT_REQUEST
      : tab.value === "comments"
        ? SEARCH.CONTENT
        : SEARCH.TITLE
  void load()
})
watch(solved, () => {
  if (tab.value === "reports") void load()
})
onMounted(load)
</script>

<template>
  <PageHeader
    eyebrow="Administration"
    title="Moderation"
    description="Review recent content, remove abuse, and resolve member reports."
  />
  <Card
    ><CardContent class="p-3"
      ><div class="mb-3 flex flex-wrap gap-2">
        <Button
          v-for="item in [
            { id: 'posts', label: 'Posts', icon: MessagesSquare },
            { id: 'comments', label: 'Comments', icon: MessageCircle },
            { id: 'reports', label: 'Reports', icon: CheckCircle2 },
          ] as const"
          :key="item.id"
          :variant="tab === item.id ? 'secondary' : 'ghost'"
          size="sm"
          @click="tab = item.id"
          ><component :is="item.icon" />{{ item.label }}</Button
        ><Button
          v-if="tab !== 'reports' && selected.length"
          variant="destructive"
          size="sm"
          class="ml-auto"
          @click="removeOpen = true"
          ><Trash2 />Remove {{ selected.length }}</Button
        >
      </div>
      <form class="flex flex-col gap-2 sm:flex-row" @submit.prevent="search">
        <SelectField v-model="option" class="sm:w-40"
          ><template v-if="tab === 'posts'"
            ><option :value="SEARCH.TITLE">Title</option>
            <option :value="SEARCH.WRITER">Author</option></template
          ><template v-else-if="tab === 'comments'"
            ><option :value="SEARCH.CONTENT">Content</option>
            <option :value="SEARCH.WRITER">Author</option></template
          ><template v-else
            ><option :value="SEARCH.REPORT_TO">Reported user</option>
            <option :value="SEARCH.REPORT_FROM">Reporter</option>
            <option :value="SEARCH.REPORT_REQUEST">Request</option>
            <option :value="SEARCH.REPORT_RESPONSE">Response</option></template
          ></SelectField
        >
        <div class="relative flex-1">
          <Search
            class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          /><Input v-model="keyword" class="pl-9" placeholder="Search moderation records" />
        </div>
        <CheckboxField
          v-if="tab === 'reports'"
          v-model="solved"
          class="self-center"
          label="Resolved"
        /><Button type="submit">Search</Button>
      </form></CardContent
    ></Card
  >
  <Card class="mt-4"
    ><CardContent class="p-0"
      ><div v-if="loading" class="py-20 text-center">
        <Spinner label="Loading moderation queue" />
      </div>
      <Table v-else-if="tab !== 'reports' && rows.length"
        ><TableHeader
          ><TableRow
            ><TableHead class="w-10" /><TableHead>Content</TableHead><TableHead>Community</TableHead
            ><TableHead>Author</TableHead><TableHead>Date</TableHead></TableRow
          ></TableHeader
        ><TableBody
          ><TableRow v-for="item in rows" :key="item.uid"
            ><TableCell
              ><input
                type="checkbox"
                :checked="selected.includes(item.uid)"
                class="size-4 accent-primary"
                @change="
                  select(item.uid, ($event.target as HTMLInputElement).checked)
                " /></TableCell
            ><TableCell
              ><RouterLink
                :to="`/board/${item.id}/${'postUid' in item ? item.postUid : item.uid}`"
                class="block max-w-md truncate font-medium hover:text-primary"
                >{{ "title" in item ? item.title : stripTags(item.content) }}</RouterLink
              >
              <p class="text-xs text-muted-foreground">
                {{ item.like }} votes<span v-if="'comment' in item">
                  · {{ item.comment }} comments</span
                >
              </p></TableCell
            ><TableCell
              ><Badge variant="outline">t/{{ item.id }}</Badge></TableCell
            ><TableCell
              ><div class="flex items-center gap-2">
                <Avatar :src="item.writer.profile" class="size-7" />{{ item.writer.name }}
              </div></TableCell
            ><TableCell class="whitespace-nowrap text-muted-foreground">{{
              formatDate(item.date, true)
            }}</TableCell></TableRow
          ></TableBody
        ></Table
      ><Table v-else-if="tab === 'reports' && reports.length"
        ><TableHeader
          ><TableRow
            ><TableHead>Reported</TableHead><TableHead>Reporter</TableHead
            ><TableHead>Request</TableHead><TableHead>Date</TableHead
            ><TableHead /></TableRow></TableHeader
        ><TableBody
          ><TableRow v-for="report in reports" :key="report.uid"
            ><TableCell>{{ report.to.name }}</TableCell
            ><TableCell>{{ report.from.name }}</TableCell
            ><TableCell
              ><p class="max-w-sm truncate">{{ report.request }}</p>
              <p v-if="report.response" class="max-w-sm truncate text-xs text-muted-foreground">
                Response: {{ report.response }}
              </p></TableCell
            ><TableCell class="whitespace-nowrap">{{ formatDate(report.date, true) }}</TableCell
            ><TableCell
              ><Button variant="outline" size="sm" @click="openResolve(report)">{{
                report.solved ? "Review" : "Resolve"
              }}</Button></TableCell
            ></TableRow
          ></TableBody
        ></Table
      ><EmptyState
        v-else
        title="Queue is clear"
        message="No items match the current moderation filter."
      />
      <div v-if="tab === 'reports'" class="border-t p-4">
        <PaginationBar :page="page" :total="reportTotal" :page-size="limit" @change="changePage" />
      </div>
      <div v-else-if="rows.length" class="flex justify-center gap-2 border-t p-4">
        <Button variant="outline" :disabled="page <= 1" @click="changePage(page - 1)"
          >Previous</Button
        ><Badge variant="outline" class="px-4">Page {{ page }}</Badge
        ><Button variant="outline" :disabled="rows.length < limit" @click="changePage(page + 1)"
          >Next</Button
        >
      </div></CardContent
    ></Card
  >
  <Dialog
    v-model="removeOpen"
    title="Remove selected content?"
    :description="`${selected.length} items will be hidden from the community.`"
    width="sm"
    ><template #footer
      ><Button variant="ghost" @click="removeOpen = false">Cancel</Button
      ><Button variant="destructive" @click="removeSelected">Remove items</Button></template
    ></Dialog
  >
  <Dialog
    v-model="resolveOpen"
    :title="`Resolve report #${selectedReport?.uid ?? ''}`"
    description="Record the moderation decision for the reporter and audit trail."
    ><div class="space-y-4">
      <div class="rounded-lg bg-muted p-3 text-sm">
        <p class="text-xs font-medium uppercase text-muted-foreground">Request</p>
        <p class="mt-1">{{ selectedReport?.request }}</p>
      </div>
      <div class="space-y-2">
        <Label for="report-response">Response</Label
        ><Textarea id="report-response" v-model="response" required />
      </div>
    </div>
    <template #footer
      ><Button variant="ghost" @click="resolveOpen = false">Cancel</Button
      ><Button :disabled="response.trim().length < 2" @click="resolve"
        >Save resolution</Button
      ></template
    ></Dialog
  >
</template>
