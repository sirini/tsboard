import { api } from "@/lib/api"
import type { BoardConfig } from "@/types/board"
import type { Resp } from "@/types/common"
import type { HomeGroup, HomeLatestQuery, HomePost, NotificationItem } from "@/types/content"

export const homeApi = {
  visit: (userUid?: number) => api<Resp<null>>("/home/visit", { query: { userUid } }),
  menus: () => api<Resp<HomeGroup[]>>("/home/sidebar/links"),
  posts: (query: HomeLatestQuery) => api<Resp<HomePost[]>>("/home/latest", { query }),
  boardPosts: (id: string, limit: number) =>
    api<Resp<{ items: HomePost[]; config: BoardConfig }>>(`/home/latest/${id}`, {
      query: { limit },
    }),
  notifications: (limit = 30) =>
    api<Resp<NotificationItem[]>>("/home/noti/load", { query: { limit } }),
  checkNotifications: () => api<Resp<null>>("/home/noti/checked", { method: "PATCH", body: {} }),
  checkNotification: (uid: number) =>
    api<Resp<null>>(`/home/noti/checked/${uid}`, { method: "PATCH", body: {} }),
}
