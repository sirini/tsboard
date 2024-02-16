/**
 * server/database/board/list
 *
 * 게시판 목록보기에 필요한 함수들
 */

import { RowDataPacket } from "mysql2"
import {
  BoardConfig,
  CONTENT_STATUS,
  Pair,
  Post,
  PostParams,
  Writer,
} from "../../../src/interface/board"
import { table, select } from "../common"

// 게시판 기본 설정 가져오기
export async function getBoardConfig(id: string): Promise<BoardConfig> {
  let result: BoardConfig = {
    uid: 0,
    admin: {
      group: 0,
      board: 0,
    },
    type: 0,
    name: "",
    info: "",
    row: 0,
    width: 0,
    useCategory: false,
    category: [{ uid: 0, name: "" }],
    level: {
      list: 0,
      view: 0,
      write: 0,
      comment: 0,
      download: 0,
    },
    point: {
      view: 0,
      write: 0,
      comment: 0,
      download: 0,
    },
  }

  const [board] = await select(`SELECT uid, group_uid, admin_uid, type, name, 
    info, row, width, use_category, 
  level_list, level_view, level_write, level_comment, level_download, 
  point_view, point_write, point_comment, point_download
  FROM ${table}board WHERE id = '${id}' LIMIT 1`)
  if (!board) {
    return result
  }

  const categories = await select(
    `SELECT uid, name FROM ${table}board_category WHERE board_uid = ?`,
    [board.uid],
  )
  let category: Pair[] = []
  for (const cat of categories) {
    category.push({ uid: cat.uid, name: cat.name })
  }

  const [group] = await select(`SELECT admin_uid FROM ${table}group WHERE uid = ? LIMIT 1`, [
    board.group_uid,
  ])

  result = {
    uid: board.uid,
    admin: {
      group: group.admin_uid,
      board: board.admin_uid,
    },
    type: board.type,
    name: board.name,
    info: board.info,
    row: board.row,
    width: board.width,
    useCategory: board.use_category,
    category,
    level: {
      list: board.level_list,
      view: board.level_view,
      write: board.level_write,
      comment: board.level_comment,
      download: board.level_download,
    },
    point: {
      view: board.point_view,
      write: board.point_write,
      comment: board.point_comment,
      download: board.point_download,
    },
  }

  return result
}

// 글 개수 반환하기
export async function getPostCount(boardUid: number): Promise<number> {
  const [total] = await select(
    `SELECT COUNT(*) AS post_count FROM ${table}post WHERE board_uid = ? AND status > ?`,
    [boardUid, -1],
  )
  if (!total) {
    return 0
  }
  return total.post_count
}

type RelatedInfo = {
  writer: Writer
  like: number
  liked: boolean
  category: Pair
  reply: number
}

// 게시글에 연관된 정보 가져오기
async function getRelatedInfo(
  postUid: number,
  userUid: number,
  categoryUid: number,
): Promise<RelatedInfo> {
  let result: RelatedInfo = {
    writer: { uid: userUid, name: "", profile: "" },
    like: 0,
    liked: false,
    category: { uid: 0, name: "" },
    reply: 0,
  }

  const [user] = await select(`SELECT name, profile FROM ${table}user WHERE uid = ? LIMIT 1`, [
    userUid,
  ])
  if (!user) {
    return result
  }
  result.writer.name = user.name
  result.writer.profile = user.profile

  const [like] = await select(
    `SELECT COUNT(*) AS total_count FROM ${table}post_like WHERE post_uid = ? AND liked = ?`,
    [postUid, 1],
  )
  if (like) {
    result.like = like.total_count
  }

  const [isLiked] = await select(
    `SELECT liked FROM ${table}post_like WHERE post_uid = ? AND user_uid = ? LIMIT 1`,
    [postUid, userUid],
  )
  if (isLiked) {
    result.liked = isLiked.liked > 0 ? true : false
  }

  const [category] = await select(
    `SELECT uid, name FROM ${table}board_category WHERE uid = ? LIMIT 1`,
    [categoryUid],
  )
  if (category) {
    result.category = {
      uid: category.uid,
      name: category.name,
    }
  }

  const [reply] = await select(
    `SELECT COUNT(*) AS total_count FROM ${table}comment WHERE post_uid = ?`,
    [postUid],
  )
  if (reply) {
    result.reply = reply.total_count
  }
  return result
}

// (검색된) 포스트들 결과로 정리하여 반환하기
async function makePostResult(posts: RowDataPacket[]): Promise<Post[]> {
  let result: Post[] = []
  for (const post of posts) {
    const info = await getRelatedInfo(post.uid, post.user_uid, post.category_uid)
    result.push({
      uid: post.uid,
      writer: info.writer,
      content: post.content,
      like: info.like,
      liked: info.liked,
      submitted: post.submitted,
      modified: post.modified,
      status: post.status,
      category: info.category,
      reply: info.reply,
      title: post.title,
      hit: post.hit,
    })
  }
  return result
}

// 글 목록 가져오기
export async function getPosts(param: PostParams): Promise<Post[]> {
  let result: Post[] = []
  const last = 1 + param.total - (param.page - 1) * param.bunch
  const notices = await select(
    `SELECT uid, user_uid, category_uid, title, content, submitted, modified, hit, status FROM ${table}post 
  WHERE board_uid = ? AND status > ?`,
    [param.boardUid, CONTENT_STATUS.NORMAL],
  )
  result.push(...(await makePostResult(notices)))

  const posts = await select(
    `SELECT uid, user_uid, category_uid, title, content, submitted, modified, hit, status FROM ${table}post 
    WHERE board_uid = ? AND status = ? AND uid < ? ORDER BY uid DESC LIMIT ?`,
    [param.boardUid, CONTENT_STATUS.NORMAL, last, param.bunch - result.length],
  )
  result.push(...(await makePostResult(posts)))

  return result
}

// 목록보기에 레벨 제한이 있을 시 회원의 레벨 가져오기
export async function getUserLevel(userUid: number): Promise<number> {
  let level = 0
  const [user] = await select(`SELECT level FROM ${table}user WHERE uid = ? LIMIT 1`, [userUid])
  if (user) {
    level = user.level
  }
  return level
}
