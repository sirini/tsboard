/**
 * interface/board/index.ts
 *
 * 게시판에서 사용되는 각종 인터페이스 모음
 */

import { Exif } from "./gallery"

export type Pair = {
  uid: number
  name: string
}

export type CountPair = Pair & {
  count: number
}

export type PostFile = Pair & {
  size: number
}

export type Writer = Pair & {
  profile: string
  signature?: string
}

export type BoardAccessPoint = {
  view: number
  write: number
  comment: number
  download: number
}

export type BoardAccessLevel = BoardAccessPoint & {
  list: number
}

export type BoardType = 0 | 1 | 2 | 3
export type BoardConfig = {
  uid: number
  admin: {
    group: number
    board: number
  }
  type: BoardType
  name: string
  info: string
  rowCount: number
  width: number
  useCategory: boolean
  category: Pair[]
  level: BoardAccessLevel
  point: BoardAccessPoint
}

type ContentCommon = {
  uid: number
  writer: Writer
  like: number
  liked: boolean
  submitted: number
  status: -1 | 0 | 1 /* CONTENT_STATUS */
}

export type Post = ContentCommon & {
  category: Pair
  reply: number
  title: string
  hit: number
}

export type PostView = Post & {
  content: string
  modified: number
}

type PostCommentParams = {
  page: number
  bunch: number
  sinceUid: number
  accessUserUid: number
  pagingDirection: number
}

export type SearchOption = 0 | 1 | 2 | 3 | 4
export type PostParams = PostCommentParams & {
  boardUid: number
  option: SearchOption
  keyword: string
}

export type SearchPostParams = PostParams & {
  direction: ">" | "<"
  ordering: "ASC" | "DESC"
  noticeCount: number
}

export type PhotoItemParams = {
  files: string[]
  thumbnails: string[]
  exifs: Exif[]
}

export type CommentParams = PostCommentParams & {
  postUid: number
}

export type Comment = ContentCommon & {
  replyUid: number
  postUid: number
  content: string
  modified: number
}

export type RelatedParams = {
  uid: number
  writerUid: number
  viewerUid: number
}

export type PostRelatedParams = RelatedParams & {
  categoryUid: number
}

export type CommonPairParam = {
  boardUid: number
  accessUserUid: number
}

type LikeParams = CommonPairParam & {
  liked: number
}

export type PostLikeParams = LikeParams & {
  postUid: number
}

export type CommentLikeParams = LikeParams & {
  commentUid: number
}

export type SaveCommentParams = CommonPairParam & {
  postUid: number
  content: string
}

export type SaveReplyParams = SaveCommentParams & {
  replyTargetUid: number
}

export type SaveModifyParams = {
  content: string
  modifyTargetUid: number
}

export type TargetTable = "post" | "comment"
export type CheckUserPermissionParams = CommonPairParam & {
  targetTable: TargetTable
  targetUid: number
}

export type PointAction = "view" | "comment" | "write" | "download"
export type UpdateUserPointParams = CommonPairParam & {
  action: PointAction
}

export type UpdatePointHistoryParams = CommonPairParam & {
  action: PointAction
  point: number
}

export type PermissionAction = "write_post" | "write_comment" | "send_chat" | "send_report"
export type CheckPermissionParams = {
  accessUserUid: number
  boardUid: number
  postUid: number
  action: PermissionAction
  target: TargetTable
}

export type CommentRelated = {
  writer: Writer
  like: number
  liked: boolean
}

export type PostRelated = CommentRelated & {
  category: Pair
  reply: number
}

export type AutoSaveItems = {
  title: string
  content: string
  contentWithSyntax: string
  tags: string
}
