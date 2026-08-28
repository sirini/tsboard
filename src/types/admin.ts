import type { BoardConfig, BoardType, BoardWriter, PostStatus } from "./board"
import type { Pair, Search } from "./common"
import type { UserBasicInfo } from "./user"

export type DashboardSeries = { history: Array<{ date: number; visit: number }>; total: number }
export type DashboardStatistics = {
  visit: DashboardSeries
  member: DashboardSeries
  post: DashboardSeries
  reply: DashboardSeries
  file: DashboardSeries
  image: DashboardSeries
}
export type DashboardItems = { groups: Pair[]; boards: Pair[]; members: BoardWriter[] }

export type AdminGroup = { uid: number; id: string; count: number; manager: BoardWriter }
export type AdminBoardStats = { post: number; comment: number; file: number; image: number }
export type AdminGroupBoard = AdminGroup & {
  type: BoardType
  name: string
  info: string
  skinKey: string
  total: AdminBoardStats
}
export type AdminGroupDetail = { config: AdminGroup; boards: AdminGroupBoard[] }
export type AdminBoardDetail = { config: BoardConfig; groups: Pair[] }

export type AdminBoardInput = {
  adminUid: number
  categories: string
  groupUid: number
  id: string
  info: string
  levelComment: number
  levelDownload: number
  levelList: number
  levelView: number
  levelWrite: number
  name: string
  pointComment: number
  pointDownload: number
  pointView: number
  pointWrite: number
  rowCount: number
  type: BoardType
  useCategory: boolean
  width: number
  skinKey: string
}

export type AdminLatestQuery = { page: number; limit: number; option: Search; keyword: string }
export type AdminLatestBase = {
  uid: number
  id: string
  type: BoardType
  name: string
  like: number
  date: number
  status: PostStatus
  writer: BoardWriter
}
export type AdminLatestPost = AdminLatestBase & { title: string; comment: number; hit: number }
export type AdminLatestComment = AdminLatestBase & { content: string; postUid: number }

export type AdminReport = {
  uid: number
  to: BoardWriter
  from: BoardWriter
  request: string
  response: string
  date: number
  solved: boolean
}
export type AdminReportResult = { item: AdminReport[]; total: number }

export type AdminUser = UserBasicInfo & { id: string; level: number; point: number; signup: number }
export type AdminUserResult = { item: AdminUser[]; total: number }
export type AdminUserDetail = BoardWriter & { id: string; level: number; point: number }
export type AdminUserInput = {
  id: string
  name: string
  password: string
  profile: File | null
  oldProfile: string
  level: number
  point: number
  signature: string
}

export type MailStatus = {
  configured: boolean
  provider: "resend"
  from: string
  replyTo: string
  domainStatus: "verified" | "pending" | "failed" | "not_found" | "not_configured" | "unknown"
  freeDaily: number
  freeMonthly: number
  freeMarketingContacts: number
}
export type MailCampaignStatus = "draft" | "syncing" | "ready" | "sending" | "sent" | "failed"
export type MailCampaign = {
  uid: number
  subject: string
  markdown: string
  status: MailCampaignStatus
  recipientCount: number
  resendBroadcastId: string
  lastError: string
  created: number
  updated: number
  sent: number
}
export type MailCampaignList = { items: MailCampaign[]; total: number }
export type MailDelivery = {
  uid: number
  type: string
  recipient: string
  subject: string
  provider: string
  providerMessageId: string
  status: "accepted" | "failed"
  error: string
  created: number
}
export type MailDeliveryList = {
  items: MailDelivery[]
  total: number
  page: number
  limit: number
  summary: Record<string, number>
}
