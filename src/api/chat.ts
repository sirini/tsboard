import { api } from "@/lib/api"
import type { Resp } from "@/types/common"
import type { ChatItem, ChatMessage } from "@/types/content"

export const chatApi = {
  list: (limit = 30) => api<Resp<ChatItem[]>>("/chat/list", { query: { limit } }),
  history: (targetUserUid: number, limit = 100) =>
    api<Resp<ChatMessage[]>>("/chat/history", { query: { targetUserUid, limit } }),
  send: (targetUserUid: number, message: string) =>
    api<Resp<number>>("/chat/save", { method: "POST", body: { targetUserUid, message } }),
}
