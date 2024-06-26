/**
 * interface/home
 *
 * 홈 화면에서 필요한 인터페이스들 정의
 */

import { BoardType, SearchOption, Writer } from "./board"
import { UserBasicInfo } from "./user"

export const VISIT_KEY = "tsboardVisit"
export const LANG_KEY = "tsboardLanguage"
export const LANG = {
  KO: 0,
  EN: 1,
  CN: 2,
}
export type LangType = 0 | 1 | 2
export type NoticeType = 0 | 1 | 2 | 3 | 4

export type AddNoticeParams = {
  toUid: number
  fromUid: number
  type: NoticeType
  postUid: number
  commentUid: number
}

export type TsboardNotification = {
  uid: number
  fromUser: UserBasicInfo
  type: NoticeType
  id: string
  boardType: BoardType
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

type CommonPostItem = {
  uid: number
  category: string
  title: string
  writer: Writer
  hit: number
  like: number
  comment: number
  submitted: number
}

export type LatestPost = CommonPostItem & {
  type: BoardType
  useCategory: boolean
}

export type BoardLatest = {
  name: string
  latest: LatestPost[]
}

type LatestAdd = {
  content: string
  cover: string
  liked: boolean
}

export type PostItem = LatestPost &
  LatestAdd & {
    id: string
  }

export type BoardPostItem = CommonPostItem & LatestAdd

export type BoardLatestPost = {
  id: string
  type: BoardType
  name: string
  info: string
  useCategory: boolean
  posts: BoardPostItem[]
}

export type LatestPostParams = {
  sinceUid: number
  bunch: number
  option: SearchOption
  keyword: string
  accessUserUid: number
}
