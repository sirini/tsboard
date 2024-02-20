/**
 * server/database/board/comment
 *
 * 댓글 관련 처리
 */

import {
  CONTENT_STATUS,
  Comment,
  CommentLikeParams,
  CommentParams,
  RelatedParams,
  SaveCommentParams,
  SaveModifyParams,
  SaveReplyParams,
} from "../../../src/interface/board"
import { insert, select, table, update } from "../common"
import { addNotice } from "./common"
import {
  COMMENT_RELATED,
  CommentRelated,
  INVALID_VIEW_LEVEL,
  NOTICE_TYPE,
  NoticeType,
} from "./const"

// 댓글에 연관된 정보 가져오기
async function getCommentRelated(param: RelatedParams): Promise<CommentRelated> {
  let result: CommentRelated = COMMENT_RELATED
  const [user] = await select(`SELECT name, profile FROM ${table}user WHERE uid = ? LIMIT 1`, [
    param.user.writerUid,
  ])
  if (!user) {
    return result
  }
  result.writer = {
    uid: param.user.writerUid,
    name: user.name,
    profile: user.profile,
  }

  const [like] = await select(
    `SELECT COUNT(*) AS total_count FROM ${table}comment_like WHERE comment_uid = ? AND liked = ?`,
    [param.uid, 1],
  )
  if (like) {
    result.like = like.total_count
  }

  const [isLiked] = await select(
    `SELECT liked FROM ${table}comment_like WHERE comment_uid = ? AND user_uid = ? LIMIT 1`,
    [param.uid, param.user.viewerUid],
  )
  if (isLiked) {
    result.liked = isLiked.liked > 0 ? true : false
  } else {
    result.liked = false
  }
  return result
}

// 댓글들 가져오기
export async function getComments(param: CommentParams): Promise<Comment[]> {
  let result: Comment[] = []
  const last = 1 + param.maxUid - (param.page - 1) * param.bunch
  const comments = await select(
    `SELECT uid, reply_uid, user_uid, content, submitted, modified, status 
  FROM ${table}comment WHERE post_uid = ? AND status != ? AND uid < ? 
  ORDER BY reply_uid ASC LIMIT ?`,
    [param.postUid, CONTENT_STATUS.REMOVED, last, param.bunch],
  )
  for (const comment of comments) {
    const info = await getCommentRelated({
      uid: comment.uid,
      user: {
        writerUid: comment.user_uid,
        viewerUid: param.accessUserUid,
      },
    })
    result.push({
      uid: comment.uid,
      writer: info.writer,
      content: comment.content,
      like: info.like,
      liked: info.liked,
      submitted: comment.submitted,
      modified: comment.modified,
      status: comment.status,
      replyUid: comment.reply_uid,
      postUid: param.postUid,
    })
  }
  return result
}

// 유효한 최대 uid 값 반환하기
export async function getMaxCommentUid(postUid: number): Promise<number> {
  const [comment] = await select(
    `SELECT MAX(uid) AS max_uid FROM ${table}comment WHERE post_uid = ? AND status != ?`,
    [postUid, CONTENT_STATUS.REMOVED],
  )
  if (!comment) {
    return 0
  }
  return comment.max_uid
}

// 게시판 ID에 해당하는 uid 반환하기
export async function getBoardUid(id: string): Promise<number> {
  const [board] = await select(`SELECT uid FROM ${table}board WHERE id = '${id}' LIMIT 1`)
  if (!board) {
    return 0
  }
  return board.uid
}

// 글보기 레벨 권한 조회하기
export async function getViewPostLevel(boardUid: number): Promise<number> {
  const [board] = await select(`SELECT level_view FROM ${table}board WHERE uid = ? LIMIT 1`, [
    boardUid,
  ])
  if (!board) {
    return INVALID_VIEW_LEVEL
  }
  return board.level_view
}

// 댓글 좋아하기 누르기
export async function likeComment(param: CommentLikeParams): Promise<void> {
  const [like] = await select(
    `SELECT comment_uid FROM ${table}comment_like WHERE comment_uid = ? AND user_uid = ? LIMIT 1`,
    [param.commentUid, param.accessUserUid],
  )
  if (!like) {
    await select(
      `INSERT INTO ${table}comment_like (board_uid, comment_uid, user_uid, liked, timestamp) 
    VALUES (?, ?, ?, ? ,?)`,
      [param.boardUid, param.commentUid, param.accessUserUid, param.liked, Date.now()],
    )

    const [comment] = await select(
      `SELECT post_uid, user_uid FROM ${table}comment WHERE uid = ? LIMIT 1`,
      [param.commentUid],
    )
    if (comment) {
      addNotice({
        toUid: comment.user_uid,
        fromUid: param.accessUserUid,
        type: NOTICE_TYPE.LIKE_COMMENT as NoticeType,
        postUid: comment.post_uid,
        commentUid: param.commentUid,
      })
    }
  } else {
    await update(
      `UPDATE ${table}comment_like SET liked = ?, timestamp = ? WHERE comment_uid = ? AND user_uid = ? LIMIT 1`,
      [param.liked, Date.now(), param.commentUid, param.accessUserUid],
    )
  }
}

// 새 댓글 추가하기
export async function saveNewComment(param: SaveCommentParams): Promise<number> {
  let insertId = 0
  insertId = await insert(
    `INSERT INTO ${table}comment 
    (reply_uid, board_uid, post_uid, user_uid, content, submitted, modified, status) VALUES
    (?, ?, ?, ?, ?, ?, ?, ?)`,
    [0, param.boardUid, param.postUid, param.accessUserUid, param.content, Date.now(), 0, 0],
  )
  if (insertId > 0) {
    await update(`UPDATE ${table}comment SET reply_uid = ? WHERE uid = ? LIMIT 1`, [
      insertId,
      insertId,
    ])
    const [post] = await select(`SELECT user_uid FROM ${table}post WHERE uid = ? LIMIT 1`, [
      param.postUid,
    ])
    if (post) {
      addNotice({
        toUid: post.user_uid,
        fromUid: param.accessUserUid,
        type: NOTICE_TYPE.LEAVE_COMMENT as NoticeType,
        postUid: param.postUid,
        commentUid: insertId,
      })
    }
  }
  return insertId
}

// 답글 추가하기
export async function saveReplyComment(param: SaveReplyParams): Promise<number> {
  let insertId = await insert(
    `INSERT INTO ${table}comment (reply_uid, board_uid, post_uid, user_uid, content, submitted, modified, status) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      param.replyTargetUid,
      param.boardUid,
      param.postUid,
      param.accessUserUid,
      param.content,
      Date.now(),
      0,
      0,
    ],
  )
  const [comment] = await select(`SELECT user_uid FROM ${table}comment WHERE uid = ? LIMIT 1`, [
    param.replyTargetUid,
  ])
  if (comment) {
    addNotice({
      toUid: comment.user_uid,
      fromUid: param.accessUserUid,
      type: NOTICE_TYPE.REPLY_COMMENT as NoticeType,
      postUid: param.postUid,
      commentUid: insertId,
    })
  }
  return insertId
}

// 댓글 수정하기
export async function saveModifyComment(param: SaveModifyParams): Promise<void> {
  await update(`UPDATE ${table}comment SET content = ? WHERE uid = ? LIMIT 1`, [
    param.content,
    param.modifyTargetUid,
  ])
}
