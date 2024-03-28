/**
 * server/database/board/view
 *
 * 게시글 보기에 필요한 함수들
 */

import {
  CONTENT_STATUS,
  Pair,
  PostFile,
  PostLikeParams,
  PostView,
} from "../../../src/interface/board"
import { NoticeType } from "../../../src/interface/home"
import { removeFile } from "../../util/tools"
import { remove, select, table, update } from "../common"
import { addNotification } from "../home/notification"
import { INIT_POST_VIEW, NOTICE_TYPE } from "./const"
import { getPostRelated } from "./list"
import { statSync } from "fs"

// 게시글 가져오기
export async function getPost(postUid: number, accessUserUid: number): Promise<PostView> {
  let result: PostView = INIT_POST_VIEW
  const [post] = await select(
    `SELECT user_uid, category_uid, title, content, submitted, modified, hit, status 
  FROM ${table}post WHERE uid = ? AND status != ? LIMIT 1`,
    [postUid, CONTENT_STATUS.REMOVED],
  )
  if (!post) {
    return result
  }

  const info = await getPostRelated({
    uid: postUid,
    writerUid: post.user_uid,
    viewerUid: accessUserUid,
    categoryUid: post.category_uid,
  })
  if (!info) {
    return result
  }

  update(`UPDATE ${table}post SET hit = hit + 1 WHERE uid = ? LIMIT 1`, [postUid])

  return {
    uid: postUid,
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
  }
}

// 첨부파일들 가져오기
export async function getFiles(postUid: number): Promise<PostFile[]> {
  let result: PostFile[] = []
  const files = await select(`SELECT uid, name, path FROM ${table}file WHERE post_uid = ?`, [
    postUid,
  ])
  for (const file of files) {
    const stat = statSync(`.${file.path}`)
    result.push({
      uid: file.uid,
      name: file.name,
      size: stat.size,
    })
  }
  return result
}

// 해시태그들 가져오기
export async function getTags(postUid: number): Promise<Pair[]> {
  let result: Pair[] = []
  const tagUids = await select(`SELECT hashtag_uid FROM ${table}post_hashtag WHERE post_uid = ?`, [
    postUid,
  ])
  for (const uid of tagUids) {
    const [tag] = await select(`SELECT name FROM ${table}hashtag WHERE uid = ? LIMIT 1`, [
      uid.hashtag_uid,
    ])
    result.push({
      uid: uid.hashtag_uid,
      name: tag.name,
    })
  }
  return result
}

// 게시글 좋아하기 누르기
export async function likePost(param: PostLikeParams): Promise<void> {
  const [like] = await select(
    `SELECT post_uid FROM ${table}post_like WHERE post_uid = ? AND user_uid = ? LIMIT 1`,
    [param.postUid, param.accessUserUid],
  )
  if (!like) {
    await select(
      `INSERT INTO ${table}post_like (board_uid, post_uid, user_uid, liked, timestamp) 
    VALUES (?, ?, ?, ? ,?)`,
      [param.boardUid, param.postUid, param.accessUserUid, param.liked, Date.now()],
    )
  } else {
    await update(
      `UPDATE ${table}post_like SET liked = ?, timestamp = ? WHERE post_uid = ? AND user_uid = ? LIMIT 1`,
      [param.liked, Date.now(), param.postUid, param.accessUserUid],
    )
  }

  if (param.liked > 0) {
    const [post] = await select(`SELECT user_uid FROM ${table}post WHERE uid = ? LIMIT 1`, [
      param.postUid,
    ])

    addNotification({
      toUid: post.user_uid,
      fromUid: param.accessUserUid,
      type: NOTICE_TYPE.LIKE_POST as NoticeType,
      postUid: param.postUid,
      commentUid: 0,
    })
  }
}

// 게시판 다운로드 레벨, 다운로드 포인트 확인
export async function getDownloadPermission(
  boardUid: number,
): Promise<{ level: number; point: number }> {
  let result = {
    level: 0,
    point: 0,
  }
  const [config] = await select(
    `SELECT level_download, point_download FROM ${table}board WHERE uid = ? LIMIT 1`,
    [boardUid],
  )
  if (!config) {
    return result
  }
  result = {
    level: config.level_download,
    point: config.point_download,
  }
  return result
}

// 다운로드할 파일 경로 반환하기
export async function getDownloadPath(fileUid: number): Promise<{ path: string; name: string }> {
  let result = {
    path: "",
    name: "",
  }
  const [file] = await select(`SELECT name, path FROM ${table}file WHERE uid = ? LIMIT 1`, [
    fileUid,
  ])
  if (!file) {
    return result
  }
  return {
    path: `.${file.path}`,
    name: file.name,
  }
}

// 글작성자의 블랙리스트 대상자인지 확인
export async function isBannedByWriter(postUid: number, accessUserUid: number): Promise<boolean> {
  const [post] = await select(`SELECT user_uid FROM ${table}post WHERE uid = ? LIMIT 1`, [postUid])
  if (!post) {
    return false
  }
  const [blacklist] = await select(
    `SELECT black_uid FROM ${table}user_black_list WHERE user_uid = ? AND black_uid = ? LIMIT 1`,
    [post.user_uid, accessUserUid],
  )
  if (!blacklist) {
    return false
  }
  return true
}

// 게시글 삭제 표기하고 소속된 댓글들도 삭제 표기 및 첨부 파일, 썸네일은 삭제
export async function removePost(postUid: number): Promise<void> {
  update(`UPDATE ${table}post SET status = ? WHERE uid = ? LIMIT 1`, [-1, postUid])
  update(`UPDATE ${table}comment SET status = ? WHERE post_uid = ?`, [-1, postUid])

  const files = await select(`SELECT path FROM ${table}file WHERE post_uid = ?`, [postUid])
  for (const file of files) {
    removeFile(`.${file.path}`)
  }
  remove(`DELETE FROM ${table}file WHERE post_uid = ?`, [postUid])

  const thumbs = await select(`SELECT path FROM ${table}file_thumbnail WHERE post_uid = ?`, [
    postUid,
  ])
  for (const thumb of thumbs) {
    removeFile(`.${thumb.path}`)
  }
  remove(`DELETE FROM ${table}file_thumbnail WHERE post_uid = ?`, [postUid])
}
