/**
 * interface/home
 *
 * 홈 화면에서 필요한 인터페이스들 정의
 */

import { BoardType, SearchOption, Writer } from "./board"
import { UserBasicInfo } from "./user"

export type NoticeType = 0 | 1 | 2 | 3 | 4

export type AddNoticeParams = {
  toUid: number
  fromUid: number
  type: NoticeType
  postUid: number
  commentUid: number
}

export type Notification = {
  uid: number
  fromUser: UserBasicInfo
  type: NoticeType
  id: string
  postUid: number
  checked: boolean
  timestamp: number
}

export type BoardItem = {
  id: string
  type: BoardType
  name: string
  info: string
}

export type GroupItem = {
  group: string
  boards: BoardItem[]
}

export type LatestPost = {
  uid: number
  type: BoardType
  category: string
  title: string
  writer: Writer
  hit: number
  submitted: number
}

export type PostItem = LatestPost & {
  id: string
  useCategory: boolean
  content: string
  cover: string
  like: number
}

export type LatestPostParams = {
  sinceUid: number
  bunch: number
  option: SearchOption
  keyword: string
}
