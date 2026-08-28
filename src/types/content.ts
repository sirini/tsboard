import type { BoardAttachment, BoardConfig, BoardListItem, BoardType } from "./board"
import type { Pair, Search } from "./common"
import type { UserBasicInfo } from "./user"

export type HomePost = BoardListItem & { id: string; type: BoardType; useCategory: boolean }
export type HomeGroup = {
  group: string
  boards: Array<{ id: string; type: BoardType; name: string; info: string }>
}
export type HomeLatestQuery = {
  sinceUid?: number
  bunch?: number
  option?: Search
  keyword?: string
}

export type NotificationItem = {
  uid: number
  fromUser: UserBasicInfo
  type: 0 | 1 | 2 | 3 | 4
  id: string
  boardType: BoardType
  postUid: number
  checked: boolean
  timestamp: number
}

export type CommentItem = {
  uid: number
  writer: UserBasicInfo
  content: string
  like: number
  liked: boolean
  submitted: number
  modified: number
  status: number
  replyUid: number
  postUid: number
}
export type CommentList = {
  boardUid: number
  sinceUid: number
  totalCommentCount: number
  comments: CommentItem[]
}

export type EditorConfig = { config: BoardConfig; isAdmin: boolean; categories: Pair[] }
export type EditorPost = { post: BoardListItem; files: BoardAttachment[]; tags: Pair[] }
export type EditorTag = Pair & { count: number }
export type EditorImages = { images: Pair[]; maxImageUid: number; totalImageCount: number }

export type ChatItem = { sender: UserBasicInfo; uid: number; message: string; timestamp: number }
export type ChatMessage = { uid: number; userUid: number; message: string; timestamp: number }
