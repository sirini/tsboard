/**
 * server/database/home/list
 *
 * 첫화면 최신글 보기에 필요한 함수들
 */

import { RowDataPacket } from "mysql2"
import { BoardType, SearchOption } from "../../../src/interface/board"
import {
  BoardLatest,
  BoardLatestPost,
  LatestPost,
  LatestPostParams,
  PostItem,
} from "../../../src/interface/home"
import { table, select } from "../common"
import {
  getCategoryInfo,
  getHashtagUids,
  getPostLikeCount,
  getUserBasic,
  isPostViewerLiked,
} from "../board/list"
import { CONTENT_STATUS, SEARCH_OPTION } from "../board/const"
import { getTotalCommentCount } from "../board/comment"

// 가장 최신글의 고유 번호 가져오기
export async function getMaxUid(): Promise<number> {
  const [post] = await select(`SELECT MAX(uid) AS max_uid FROM ${table}post`)
  if (!post) {
    return 0
  }
  return post.max_uid
}

// 제목 혹은 본문 검색
async function searchTitleContent(param: LatestPostParams): Promise<RowDataPacket[]> {
  const option = param.option === SEARCH_OPTION.TITLE ? "title" : "content"
  const result = await select(
    `SELECT uid, board_uid, user_uid, category_uid, title, content, hit 
    FROM ${table}post WHERE status = ? AND ${option} LIKE '%${param.keyword}%' AND uid < ? 
    ORDER BY uid DESC LIMIT ?`,
    [CONTENT_STATUS.NORMAL.toString(), param.sinceUid.toString(), param.bunch.toString()],
  )
  return result
}

// 태그명으로 검색
async function searchTagName(param: LatestPostParams): Promise<RowDataPacket[]> {
  const tags = param.keyword.split(" ")
  const tagUidStr = await getHashtagUids(tags)
  const result = await select(
    `SELECT ${table}post.uid, ${table}post.board_uid, ${table}post.user_uid, ${table}post.category_uid, title, content, hit
    FROM ${table}post JOIN ${table}post_hashtag ON ${table}post.uid = ${table}post_hashtag.post_uid 
    WHERE ${table}post.status = ? AND uid < ? AND ${table}post_hashtag.hashtag_uid IN ('${tagUidStr}')
    GROUP BY ${table}post_hashtag.post_uid HAVING (COUNT(${table}post_hashtag.hashtag_uid) = ?)
    ORDER BY ${table}post.uid DESC LIMIT ?`,
    [
      CONTENT_STATUS.NORMAL.toString(),
      param.sinceUid.toString(),
      tags.length.toString(),
      param.bunch.toString(),
    ],
  )
  return result
}

// 글 작성자 이름으로 검색
async function searchWriterName(param: LatestPostParams): Promise<RowDataPacket[]> {
  let result: RowDataPacket[] = []
  const [writer] = await select(`SELECT uid FROM ${table}user WHERE name = ? LIMIT 1`, [
    param.keyword,
  ])
  if (writer) {
    result = await select(
      `SELECT uid, board_uid, user_uid, category_uid, title, content, hit
    FROM ${table}post WHERE status = ? AND user_uid = ? AND uid < ? 
    ORDER BY uid DESC LIMIT ?`,
      [CONTENT_STATUS.NORMAL, writer.uid, param.sinceUid, param.bunch],
    )
  }
  return result
}

// 검색하기
async function getSearchedPosts(param: LatestPostParams): Promise<RowDataPacket[]> {
  let result: RowDataPacket[] = []

  if (
    param.option === (SEARCH_OPTION.TITLE as SearchOption) ||
    param.option === (SEARCH_OPTION.CONTENT as SearchOption)
  ) {
    result = await searchTitleContent(param)
  } else if (param.option === (SEARCH_OPTION.WRITER as SearchOption)) {
    result = await searchWriterName(param)
  } else if (param.option === (SEARCH_OPTION.TAG as SearchOption)) {
    result = await searchTagName(param)
  }
  return result
}

// 지정된 키 인덱스 이하의 최근 포스트들 가져오기
export async function getLatestPost(param: LatestPostParams): Promise<PostItem[]> {
  let result: PostItem[] = []
  let posts: RowDataPacket[] = []

  if (param.keyword.length < 1) {
    posts = await select(
      `SELECT uid, board_uid, user_uid, category_uid, title, content, submitted, hit FROM ${table}post 
    WHERE status = ? AND uid < ? ORDER BY uid DESC LIMIT ?`,
      [CONTENT_STATUS.NORMAL.toString(), param.sinceUid.toString(), param.bunch.toString()],
    )
  } else {
    posts = await getSearchedPosts(param)
  }

  for (const post of posts) {
    const [board] = await select(
      `SELECT id, type, use_category FROM ${table}board WHERE uid = ? LIMIT 1`,
      [post.board_uid],
    )
    if (!board) {
      continue
    }

    const writer = await getUserBasic(post.user_uid)
    const cat = await getCategoryInfo(post.category_uid)
    const commentCount = await getTotalCommentCount(post.uid)
    const likeCount = await getPostLikeCount(post.uid)
    const liked = await isPostViewerLiked(post.uid, param.accessUserUid)
    const [file] = await select(
      `SELECT path FROM ${table}file_thumbnail WHERE post_uid = ? LIMIT 1`,
      [post.uid],
    )
    const cover = (file?.path as string) ?? ""

    result.push({
      uid: post.uid,
      id: board.id,
      type: board.type as BoardType,
      useCategory: board.use_category > 0 ? true : false,
      category: cat.name,
      title: post.title,
      content: post.content,
      cover,
      writer,
      submitted: post.submitted,
      hit: post.hit,
      like: likeCount,
      liked,
      comment: commentCount,
    })
  }

  return result
}

// 주어진 게시판 아이디에 해당하는 최근 포스트들 가져오기
export async function getBoardLatestPosts(
  id: string,
  limit: number,
  accessUserUid: number,
): Promise<BoardLatestPost> {
  let result: BoardLatestPost = {
    name: "",
    info: "",
    posts: [] as PostItem[],
  }

  const [board] = await select(
    `SELECT uid, type, name, info, use_category FROM ${table}board WHERE id = ? LIMIT 1`,
    [id],
  )
  if (!board) {
    return result
  }

  result.name = board.name
  result.info = board.info

  const posts = await select(
    `SELECT uid, user_uid, category_uid, title, content, submitted, hit FROM ${table}post 
  WHERE board_uid = ? AND status = ? ORDER BY uid DESC LIMIT ?`,
    [board.uid, CONTENT_STATUS.NORMAL.toString(), limit.toString()],
  )

  for (const post of posts) {
    const writer = await getUserBasic(post.user_uid)
    const cat = await getCategoryInfo(post.category_uid)
    const commentCount = await getTotalCommentCount(post.uid)
    const likeCount = await getPostLikeCount(post.uid)
    const liked = await isPostViewerLiked(post.uid, accessUserUid)
    const [file] = await select(
      `SELECT path FROM ${table}file_thumbnail WHERE post_uid = ? LIMIT 1`,
      [post.uid],
    )
    const cover = (file?.path as string) ?? ""

    result.posts.push({
      uid: post.uid,
      id,
      type: board.type as BoardType,
      useCategory: board.use_category > 0 ? true : false,
      category: cat.name,
      title: post.title,
      content: post.content,
      cover,
      writer,
      submitted: post.submitted,
      hit: post.hit,
      like: likeCount,
      liked,
      comment: commentCount,
    })
  }

  return result
}

// 주어진 게시판 아이디에 해당하는 최근 게시글들 가져오기
export async function getBoardLatests(id: string, limit: number): Promise<BoardLatest> {
  let result: BoardLatest = {
    name: "",
    latest: [] as LatestPost[],
  }
  const [board] = await select(
    `SELECT uid, type, name, use_category FROM ${table}board WHERE id = ? LIMIT 1`,
    [id],
  )
  if (!board) {
    return result
  }

  result.name = board.name
  const posts = await select(
    `SELECT uid, user_uid, category_uid, title, submitted, hit FROM ${table}post 
  WHERE board_uid = ? AND status = ? ORDER BY uid DESC LIMIT ?`,
    [board.uid, CONTENT_STATUS.NORMAL.toString(), limit.toString()],
  )
  for (const post of posts) {
    const writer = await getUserBasic(post.user_uid)
    const cat = await getCategoryInfo(post.category_uid)
    const commentCount = await getTotalCommentCount(post.uid)
    const likeCount = await getPostLikeCount(post.uid)

    result.latest.push({
      uid: post.uid,
      type: board.type as BoardType,
      useCategory: board.use_category > 0 ? true : false,
      category: cat.name,
      title: post.title,
      writer,
      submitted: post.submitted,
      hit: post.hit,
      like: likeCount,
      comment: commentCount,
    })
  }

  return result
}
