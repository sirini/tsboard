import { api } from "@/lib/api"
import type {
  AdminBoardDetail,
  AdminBoardInput,
  AdminGroup,
  AdminGroupDetail,
  AdminLatestComment,
  AdminLatestPost,
  AdminLatestQuery,
  AdminReportResult,
  AdminUserDetail,
  AdminUserInput,
  AdminUserResult,
  DashboardItems,
  DashboardStatistics,
  MailCampaign,
  MailCampaignList,
  MailDeliveryList,
  MailStatus,
} from "@/types/admin"
import type { BoardWriter } from "@/types/board"
import type { Resp, Search } from "@/types/common"

export const dashboardApi = {
  statistics: (limit = 14) =>
    api<Resp<DashboardStatistics>>("/admin/dashboard/statistic", { query: { limit } }),
  items: (limit = 5) => api<Resp<DashboardItems>>("/admin/dashboard/item", { query: { limit } }),
  usage: () => api<Resp<number>>("/admin/dashboard/usage"),
  version: () =>
    api<{ status: string; service: string; version: string; apiContract: string }>("/version"),
}

export const groupAdminApi = {
  list: () => api<Resp<AdminGroup[]>>("/admin/group/list"),
  detail: (id: string) => api<Resp<AdminGroupDetail>>("/admin/group/load", { query: { id } }),
  candidates: (name: string, limit = 10) =>
    api<Resp<BoardWriter[]>>("/admin/group/candidates", { query: { name, limit } }),
  ids: (id: string) => api<Resp<string[]>>("/admin/group/groupids", { query: { id } }),
  create: (newGroupId: string) =>
    api<Resp<AdminGroup>>("/admin/group/create", { method: "POST", body: { newGroupId } }),
  update: (groupUid: number, newGroupId: string) =>
    api<Resp<null>>("/admin/group/update", { method: "POST", body: { groupUid, newGroupId } }),
  changeAdmin: (groupUid: number, targetUserUid: number) => {
    const body = new FormData()
    body.append("groupUid", String(groupUid))
    body.append("targetUserUid", String(targetUserUid))
    return api<Resp<null>>("/admin/group/admin", { method: "POST", body })
  },
  remove: (groupUid: number) =>
    api<Resp<null>>("/admin/group/remove", { method: "DELETE", query: { groupUid } }),
}

export const boardAdminApi = {
  detail: (id: string) => api<Resp<AdminBoardDetail>>("/admin/board/load", { query: { id } }),
  candidates: (name: string, limit = 10) =>
    api<Resp<BoardWriter[]>>("/admin/board/candidates", { query: { name, limit } }),
  create: (body: AdminBoardInput) =>
    api<Resp<number>>("/admin/board/create", { method: "POST", body }),
  modify: (body: AdminBoardInput & { boardUid: number }) =>
    api<Resp<null>>("/admin/board/modify", { method: "POST", body }),
  remove: (boardUid: number) =>
    api<Resp<null>>("/admin/board/remove", { method: "DELETE", query: { boardUid } }),
}

export const moderationApi = {
  posts: (query: AdminLatestQuery) =>
    api<Resp<AdminLatestPost[]>>("/admin/latest/posts", { query }),
  comments: (query: AdminLatestQuery) =>
    api<Resp<AdminLatestComment[]>>("/admin/latest/comments", { query }),
  reports: (query: AdminLatestQuery & { isSolved: boolean }) =>
    api<Resp<AdminReportResult>>("/admin/report/reports", { query }),
  resolve: (reportUid: number, response: string) =>
    api<Resp<null>>("/admin/report/resolve", {
      method: "PUT",
      body: { reportUid, response },
    }),
  removePosts: (targets: number[]) => removeLatest("post", targets),
  removeComments: (targets: number[]) => removeLatest("comment", targets),
}

const removeLatest = (kind: "post" | "comment", targets: number[]) => {
  const body = new FormData()
  body.append("targets", targets.join(","))
  return api<Resp<null>>(`/admin/latest/${kind}`, { method: "DELETE", body })
}

export const userAdminApi = {
  list: (query: {
    page: number
    limit: number
    option: Search
    keyword: string
    isBlocked: boolean
  }) => api<Resp<AdminUserResult>>("/admin/user/list", { query }),
  detail: (userUid: number) =>
    api<Resp<AdminUserDetail>>("/admin/user/load", { query: { userUid } }),
  create: (input: AdminUserInput) =>
    api<Resp<number>>("/admin/user/create", { method: "POST", body: userForm(input) }),
  modify: (input: AdminUserInput & { userUid: number }) => {
    const body = userForm(input)
    body.append("userUid", String(input.userUid))
    return api<Resp<null>>("/admin/user/modify", { method: "POST", body })
  },
  remove: (userUid: number) =>
    api<Resp<null>>("/admin/user/remove", { method: "DELETE", query: { userUid } }),
}

const userForm = (input: AdminUserInput) => {
  const body = new FormData()
  body.append("id", input.id)
  body.append("name", input.name)
  body.append("password", input.password)
  body.append("level", String(input.level))
  body.append("point", String(input.point))
  body.append("signature", input.signature)
  body.append("oldProfile", input.oldProfile)
  if (input.profile) body.append("profile", input.profile)
  return body
}

export const mailAdminApi = {
  status: () => api<Resp<MailStatus>>("/admin/system/mail"),
  campaigns: (limit = 20) =>
    api<Resp<MailCampaignList>>("/admin/mail/campaigns", { query: { limit } }),
  campaign: (uid: number) => api<Resp<MailCampaign>>(`/admin/mail/campaign/${uid}`),
  deliveries: (page = 1, limit = 20) =>
    api<Resp<MailDeliveryList>>("/admin/mail/deliveries", { query: { page, limit } }),
  preview: (subject: string, markdown: string) =>
    api<Resp<{ html: string; text: string }>>("/admin/mail/preview", {
      method: "POST",
      body: { subject, markdown },
    }),
  save: (body: Pick<MailCampaign, "uid" | "subject" | "markdown">) =>
    api<Resp<MailCampaign>>("/admin/mail/campaign", { method: "POST", body }),
  test: (uid: number) => api<Resp<null>>(`/admin/mail/campaign/${uid}/test`, { method: "POST" }),
  prepare: (uid: number) =>
    api<Resp<MailCampaign>>(`/admin/mail/campaign/${uid}/prepare`, { method: "POST" }),
  send: (uid: number) =>
    api<Resp<MailCampaign>>(`/admin/mail/campaign/${uid}/send`, { method: "POST" }),
}
