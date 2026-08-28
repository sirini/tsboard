import { api } from "@/lib/api"
import type { Resp } from "@/types/common"
import type { CommentList } from "@/types/content"

type BaseComment = { boardUid: number; postUid: number; content: string; userUid: number }

export const commentApi = {
  list: (boardUid: number, postUid: number, userUid: number, page = 1, limit = 100) =>
    api<Resp<CommentList>>("/comment/list", {
      query: { boardUid, postUid, userUid, page, limit },
    }),
  write: (body: BaseComment) => api<Resp<number>>("/comment/write", { method: "POST", body }),
  reply: (body: BaseComment & { replyTargetUid: number }) =>
    api<Resp<number>>("/comment/reply", { method: "POST", body }),
  modify: (body: BaseComment & { modifyTargetUid: number }) =>
    api<Resp<null>>("/comment/modify", { method: "PATCH", body }),
  remove: (boardUid: number, userUid: number, removeTargetUid: number) =>
    api<Resp<null>>("/comment/remove", {
      method: "DELETE",
      query: { boardUid, userUid, removeTargetUid },
    }),
  like: (boardUid: number, commentUid: number, userUid: number, liked: boolean) =>
    api<Resp<null>>("/comment/like", {
      method: "PATCH",
      body: { boardUid, commentUid, userUid, liked },
    }),
}
