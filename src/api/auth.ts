import { api } from "@/lib/api"
import type { Resp } from "@/types/common"
import type {
  CurrentUser,
  SignupInvite,
  SignupInviteCreated,
  SignupResult,
  SignupStatus,
  UserInfo,
  UserPermissionManage,
  UserReportStatus,
} from "@/types/user"

export const authApi = {
  load: () => api<Resp<CurrentUser>>("/auth/load", { retry: false }),
  user: (targetUserUid: number) =>
    api<Resp<UserInfo>>("/auth/user/info", { query: { targetUserUid } }),
  signin: (id: string, password: string) =>
    api<Resp<CurrentUser>>("/auth/signin", { method: "POST", body: { id, password } }),
  logout: () => api<Resp<null>>("/auth/logout", { method: "POST" }),
  deleteAccount: () =>
    api<Resp<null>>("/auth/account", { method: "DELETE", body: { confirmation: "DELETE" } }),
  signupStatus: () => api<Resp<SignupStatus>>("/auth/signup/status"),
  checkEmail: (email: string) =>
    api<Resp<boolean>>("/auth/checkemail", { method: "POST", body: { email } }),
  checkName: (name: string) =>
    api<Resp<boolean>>("/auth/checkname", { method: "POST", body: { name } }),
  signup: (body: { id: string; password: string; name: string; invite?: string }) =>
    api<Resp<SignupResult>>("/auth/signup", { method: "POST", body }),
  verify: (body: { id: string; password: string; name: string; target: number; code: string }) =>
    api<Resp<boolean>>("/auth/verify", { method: "POST", body }),
  requestReset: (email: string) =>
    api<Resp<boolean>>("/auth/reset-password", { method: "POST", body: { email } }),
  changePassword: (body: { code: string; password: string; target: number }) =>
    api<Resp<boolean>>("/auth/user/change-password", { method: "POST", body }),
  permission: (targetUserUid: number) =>
    api<Resp<UserPermissionManage>>("/auth/user/permission", { query: { targetUserUid } }),
  updatePermission: (body: UserPermissionManage) =>
    api<Resp<null>>("/auth/user/manage", { method: "POST", body }),
  reportStatus: (targetUserUid: number) =>
    api<Resp<UserReportStatus>>("/auth/user/report", { query: { targetUserUid } }),
  report: (targetUserUid: number, content: string, checkedBlackList: boolean) =>
    api<Resp<null>>("/auth/user/report", {
      method: "POST",
      body: { targetUserUid, content, checkedBlackList },
    }),
  block: (targetUserUid: number, blocked: boolean) =>
    api<Resp<null>>("/auth/user/block", {
      method: blocked ? "PUT" : "DELETE",
      body: { targetUserUid },
    }),
}

export const updateProfile = (body: {
  name: string
  signature: string
  password: string
  profile: File | null
}) => {
  const form = new FormData()
  form.append("name", body.name)
  form.append("signature", body.signature)
  form.append("password", body.password)
  if (body.profile) form.append("profile", body.profile)
  return api<Resp<null>>("/auth/update", { method: "PATCH", body: form })
}

export const inviteApi = {
  list: () => api<Resp<SignupInvite[]>>("/admin/user/invites"),
  create: (email: string, expiresDays: number) =>
    api<Resp<SignupInviteCreated>>("/admin/user/invite", {
      method: "POST",
      body: { email, expiresDays },
    }),
  revoke: (uid: number) => api<Resp<null>>(`/admin/user/invite/${uid}`, { method: "DELETE" }),
}
