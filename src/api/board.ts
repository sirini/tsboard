import { api } from "@/lib/api"
import type {
  BoardItem,
  BoardListQuery,
  BoardListResult,
  BoardViewQuery,
  BoardViewResult,
  TradeListResult,
  TradeViewResult,
  WriterLatestContent,
} from "@/types/board"
import type { Pair, Resp } from "@/types/common"

export const boardApi = {
  list: (query: BoardListQuery) =>
    api<Resp<BoardListResult | TradeListResult>>("/board/list", { query }),
  view: (query: BoardViewQuery) =>
    api<Resp<BoardViewResult | TradeViewResult>>("/board/view", { query }),
  recentTags: (boardUid: number, limit = 12) =>
    api<Resp<Pair[]>>("/board/tag/recent", { query: { boardUid, limit } }),
  userLatest: (targetUserUid: number, limit = 8) =>
    api<Resp<WriterLatestContent>>("/board/user/latest", { query: { targetUserUid, limit } }),
  like: (boardUid: number, postUid: number, liked: boolean) =>
    api<Resp<null>>("/board/like", { method: "PATCH", body: { boardUid, postUid, liked } }),
  remove: (boardUid: number, postUid: number) =>
    api<Resp<null>>("/board/remove/post", { method: "DELETE", body: { boardUid, postUid } }),
  moveTargets: (boardUid: number) =>
    api<Resp<BoardItem[]>>("/board/move/list", { query: { boardUid } }),
  move: (boardUid: number, targetBoardUid: number, postUid: number) => {
    const body = new URLSearchParams({
      boardUid: String(boardUid),
      targetBoardUid: String(targetBoardUid),
      postUid: String(postUid),
    })
    return api<Resp<null>>("/board/move/apply", { method: "POST", body })
  },
  download: (boardUid: number, fileUid: number) =>
    api<Resp<{ name: string; path: string }>>("/board/download", { query: { boardUid, fileUid } }),
  originalImage: (boardUid: number, fileUid: number) =>
    api<Resp<{ path: string }>>("/board/original", { query: { boardUid, fileUid } }),
}
