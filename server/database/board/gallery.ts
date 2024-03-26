/**
 * server/database/board/gallery
 *
 * 갤러리 동작에 필요한 함수들
 */

import { RowDataPacket } from "mysql2"
import { CONTENT_STATUS, PostParams } from "../../../src/interface/board"
import { GridItem } from "../../../src/interface/gallery"
import { table, select } from "../common"
import { PAGING_DIRECTION } from "./const"
import { getPostRelated, getSearchedPosts } from "./list"

// 갤러리 목록 가져오기
export async function getPhotos(param: PostParams): Promise<GridItem[]> {
  let posts: RowDataPacket[] = []
  let direction: ">" | "<" = ">"
  let ordering: "ASC" | "DESC" = "ASC"
  if (param.pagingDirection === PAGING_DIRECTION.NEXT) {
    direction = "<"
    ordering = "DESC"
  }

  if (param.keyword.length > 1) {
    posts = await getSearchedPosts(param, direction, ordering)
  } else {
    posts = await select(
      `SELECT uid, user_uid, category_uid, title, content, submitted, modified, hit, status 
    FROM ${table}post WHERE board_uid = ? AND status = ? AND uid ${direction} ? ORDER BY uid ${ordering} LIMIT ?`,
      [param.boardUid, CONTENT_STATUS.NORMAL, param.sinceUid, param.bunch],
    )
  }

  let result: GridItem[] = []
  for (const post of posts) {
    const info = await getPostRelated({
      uid: post.uid,
      user: {
        writerUid: post.user_uid,
        viewerUid: param.accessUserUid,
      },
      categoryUid: post.category_uid,
    })
    const paths = await select(`SELECT path FROM ${table}file WHERE post_uid = ?`, [post.uid])
    const files: string[] = []
    for (const path of paths) {
      files.push(path.path)
    }
    const thumbnails: string[] = []
    const thumbs = await select(`SELECT path FROM ${table}file_thumbnail WHERE post_uid = ?`, [
      post.uid,
    ])
    for (const thumb of thumbs) {
      thumbnails.push(thumb.path)
    }

    result.push({
      uid: post.uid,
      writer: info.writer,
      files,
      thumbnails,
      like: info.like,
      liked: info.liked,
      reply: info.reply,
    })
  }

  return result
}
