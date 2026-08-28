<script setup lang="ts">
import { Eye, Mail, Play, Plus, RefreshCw, Save, Send, TestTube2 } from "lucide-vue-next"
import { onMounted, ref } from "vue"
import { toast } from "vue-sonner"
import { mailAdminApi } from "@/api/admin"
import EmptyState from "@/components/common/EmptyState.vue"
import HtmlContent from "@/components/common/HtmlContent.vue"
import PageHeader from "@/components/common/PageHeader.vue"
import { Alert } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaginationBar } from "@/components/ui/pagination"
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
import { formatDate } from "@/lib/utils"
import type { MailCampaign, MailDeliveryList, MailStatus } from "@/types/admin"

type Tab = "campaigns" | "deliveries"
const tab = ref<Tab>("campaigns")
const status = ref<MailStatus | null>(null)
const campaigns = ref<MailCampaign[]>([])
const delivery = ref<MailDeliveryList | null>(null)
const selected = ref<MailCampaign | null>(null)
const subject = ref("")
const markdown = ref("")
const previewHtml = ref("")
const loading = ref(true)
const busy = ref(false)
const sendOpen = ref(false)
const deliveryPage = ref(1)

const load = async () => {
  loading.value = true
  try {
    const [statusResponse, campaignResponse] = await Promise.all([
      mailAdminApi.status(),
      mailAdminApi.campaigns(),
    ])
    if (statusResponse.success) status.value = statusResponse.result
    if (campaignResponse.success) campaigns.value = campaignResponse.result.items
    if (tab.value === "deliveries") await loadDeliveries()
  } finally {
    loading.value = false
  }
}
const loadDeliveries = async () => {
  const response = await mailAdminApi.deliveries(deliveryPage.value, 20)
  if (response.success) delivery.value = response.result
  else toast.error(response.error)
}
const selectCampaign = async (uid: number) => {
  const response = await mailAdminApi.campaign(uid)
  if (!response.success) return toast.error(response.error)
  selected.value = response.result
  subject.value = response.result.subject
  markdown.value = response.result.markdown
  previewHtml.value = ""
}
const createCampaign = () => {
  selected.value = null
  subject.value = ""
  markdown.value = ""
  previewHtml.value = ""
}
const save = async () => {
  busy.value = true
  try {
    const response = await mailAdminApi.save({
      uid: selected.value?.uid ?? 0,
      subject: subject.value.trim(),
      markdown: markdown.value,
    })
    if (!response.success) return toast.error(response.error)
    selected.value = response.result
    toast.success("Campaign saved.")
    await load()
  } finally {
    busy.value = false
  }
}
const preview = async () => {
  const response = await mailAdminApi.preview(subject.value.trim(), markdown.value)
  if (!response.success) return toast.error(response.error)
  previewHtml.value = response.result.html
}
const test = async () => {
  if (!selected.value) return
  const response = await mailAdminApi.test(selected.value.uid)
  if (!response.success) return toast.error(response.error)
  toast.success("Test message accepted by the mail provider.")
}
const prepare = async () => {
  if (!selected.value) return
  busy.value = true
  try {
    const response = await mailAdminApi.prepare(selected.value.uid)
    if (!response.success) return toast.error(response.error)
    selected.value = response.result
    toast.success(`${response.result.recipientCount} recipients prepared.`)
    await load()
  } finally {
    busy.value = false
  }
}
const send = async () => {
  if (!selected.value) return
  busy.value = true
  try {
    const response = await mailAdminApi.send(selected.value.uid)
    if (!response.success) return toast.error(response.error)
    selected.value = response.result
    sendOpen.value = false
    toast.success("Campaign send started.")
    await load()
  } finally {
    busy.value = false
  }
}
const setTab = async (value: Tab) => {
  tab.value = value
  if (value === "deliveries") await loadDeliveries()
}
const changeDeliveryPage = async (value: number) => {
  deliveryPage.value = value
  await loadDeliveries()
}
onMounted(load)
</script>

<template>
  <PageHeader
    eyebrow="Administration"
    title="Mail"
    description="Review delivery health and run deliberate, auditable member campaigns."
    ><Button variant="outline" @click="load"><RefreshCw />Refresh</Button></PageHeader
  >
  <div v-if="loading" class="py-20 text-center"><Spinner label="Loading mail console" /></div>
  <div v-else class="space-y-4">
    <Alert v-if="!status?.configured" variant="destructive" title="Mail is not configured"
      >Set the Resend credentials and verified sender domain in the GOAPI environment before sending
      mail.</Alert
    >
    <div v-else class="grid gap-3 sm:grid-cols-3">
      <Card
        ><CardContent class="p-4"
          ><p class="text-xs uppercase text-muted-foreground">Provider</p>
          <p class="mt-1 font-semibold capitalize">{{ status.provider }}</p></CardContent
        ></Card
      ><Card
        ><CardContent class="p-4"
          ><p class="text-xs uppercase text-muted-foreground">Sender</p>
          <p class="mt-1 truncate font-semibold">{{ status.from }}</p></CardContent
        ></Card
      ><Card
        ><CardContent class="p-4"
          ><p class="text-xs uppercase text-muted-foreground">Domain</p>
          <Badge
            class="mt-1"
            :variant="status.domainStatus === 'verified' ? 'secondary' : 'destructive'"
            >{{ status.domainStatus }}</Badge
          ></CardContent
        ></Card
      >
    </div>
    <div class="flex gap-2">
      <Button :variant="tab === 'campaigns' ? 'secondary' : 'ghost'" @click="setTab('campaigns')"
        ><Mail />Campaigns</Button
      ><Button :variant="tab === 'deliveries' ? 'secondary' : 'ghost'" @click="setTab('deliveries')"
        ><Send />Delivery log</Button
      >
    </div>
    <div v-if="tab === 'campaigns'" class="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
      <Card
        ><CardHeader
          ><div class="flex items-center justify-between">
            <div>
              <CardTitle>Campaigns</CardTitle><CardDescription>Drafts and sends</CardDescription>
            </div>
            <Button size="icon-sm" @click="createCampaign"><Plus /></Button></div></CardHeader
        ><CardContent class="space-y-2"
          ><button
            v-for="campaign in campaigns"
            :key="campaign.uid"
            :class="[
              'w-full rounded-lg border p-3 text-left hover:bg-accent',
              selected?.uid === campaign.uid && 'border-primary bg-primary/5',
            ]"
            @click="selectCampaign(campaign.uid)"
          >
            <p class="truncate text-sm font-medium">{{ campaign.subject }}</p>
            <div class="mt-2 flex items-center justify-between">
              <Badge variant="outline">{{ campaign.status }}</Badge
              ><span class="text-xs text-muted-foreground"
                >{{ campaign.recipientCount }} recipients</span
              >
            </div></button
          ><EmptyState v-if="!campaigns.length" title="No campaigns" /></CardContent></Card
      ><Card
        ><CardHeader
          ><CardTitle>{{ selected ? `Campaign #${selected.uid}` : "New campaign" }}</CardTitle
          ><CardDescription
            >Markdown is rendered and sanitized by GOAPI before delivery.</CardDescription
          ></CardHeader
        ><CardContent class="space-y-4"
          ><div class="space-y-2">
            <Label for="mail-subject">Subject</Label
            ><Input id="mail-subject" v-model="subject" maxlength="200" />
          </div>
          <div class="space-y-2">
            <Label for="mail-body">Message</Label
            ><Textarea
              id="mail-body"
              v-model="markdown"
              class="min-h-72 font-mono"
              placeholder="# Community update"
            />
          </div>
          <div class="flex flex-wrap gap-2">
            <Button :disabled="busy" @click="save"><Save />Save</Button
            ><Button
              variant="outline"
              :disabled="!subject.trim() || !markdown.trim()"
              @click="preview"
              ><Eye />Preview</Button
            ><Button v-if="selected" variant="outline" :disabled="!status?.configured" @click="test"
              ><TestTube2 />Send test</Button
            ><Button
              v-if="selected && ['draft', 'failed'].includes(selected.status)"
              variant="outline"
              :disabled="busy"
              @click="prepare"
              ><Play />Prepare recipients</Button
            ><Button
              v-if="selected?.status === 'ready'"
              variant="destructive"
              :disabled="busy"
              @click="sendOpen = true"
              ><Send />Send to {{ selected.recipientCount }}</Button
            >
          </div>
          <Alert v-if="selected?.lastError" variant="destructive" title="Last provider error">{{
            selected.lastError
          }}</Alert>
          <div v-if="previewHtml" class="rounded-lg border bg-white p-5 text-black">
            <HtmlContent :html="previewHtml" /></div></CardContent
      ></Card>
    </div>
    <Card v-else
      ><CardHeader
        ><CardTitle>Delivery log</CardTitle
        ><CardDescription
          >Accepted and failed transactional or campaign messages.</CardDescription
        ></CardHeader
      ><CardContent class="p-0"
        ><Table v-if="delivery?.items.length"
          ><TableHeader
            ><TableRow
              ><TableHead>Recipient</TableHead><TableHead>Type</TableHead
              ><TableHead>Subject</TableHead><TableHead>Status</TableHead
              ><TableHead>Created</TableHead></TableRow
            ></TableHeader
          ><TableBody
            ><TableRow v-for="item in delivery.items" :key="item.uid"
              ><TableCell>{{ item.recipient }}</TableCell
              ><TableCell
                ><Badge variant="outline">{{ item.type }}</Badge></TableCell
              ><TableCell
                ><p class="max-w-xs truncate">{{ item.subject }}</p>
                <p v-if="item.error" class="max-w-xs truncate text-xs text-destructive">
                  {{ item.error }}
                </p></TableCell
              ><TableCell
                ><Badge :variant="item.status === 'accepted' ? 'secondary' : 'destructive'">{{
                  item.status
                }}</Badge></TableCell
              ><TableCell class="whitespace-nowrap">{{
                formatDate(item.created, true)
              }}</TableCell></TableRow
            ></TableBody
          ></Table
        ><EmptyState v-else title="No delivery records" />
        <div v-if="delivery" class="border-t p-4">
          <PaginationBar
            :page="delivery.page"
            :total="delivery.total"
            :page-size="delivery.limit"
            @change="changeDeliveryPage"
          /></div></CardContent
    ></Card>
  </div>
  <Dialog
    v-model="sendOpen"
    title="Send this campaign?"
    :description="`This will deliver to ${selected?.recipientCount ?? 0} prepared recipients.`"
    width="sm"
    ><p class="text-sm text-muted-foreground">
      Review the preview and send a test first. A prepared recipient snapshot is used so the
      audience cannot change mid-send.
    </p>
    <template #footer
      ><Button variant="ghost" @click="sendOpen = false">Cancel</Button
      ><Button variant="destructive" :disabled="busy" @click="send">Start sending</Button></template
    ></Dialog
  >
</template>
