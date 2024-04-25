/**
 * server/database/board/gallery
 *
 * 갤러리 동작에 필요한 함수들
 */

import { RowDataPacket } from "mysql2"
import { PostParams } from "../../../src/interface/board"
import { GridItem } from "../../../src/interface/gallery"
import { table, select } from "../common"
import { PAGING_DIRECTION, CONTENT_STATUS } from "./const"
import { getPostRelated, getSearchedPosts } from "./list"

// 사진들 가져오기
export async function getPhotoItems(postUid: number): Promise<{
  files: string[]
  thumbnails: string[]
}> {
  let images = {
    files: [] as string[],
    thumbnails: [] as string[],
  }
  const thumbs = await select(
    `SELECT path, full_path FROM ${table}file_thumbnail WHERE post_uid = ?`,
    [postUid.toString()],
  )
  for (const thumb of thumbs) {
    images.thumbnails.push(thumb.path)
    images.files.push(thumb.full_path)
  }
  return images
}

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
    posts = await getSearchedPosts({
      ...param,
      direction,
      ordering,
      noticeCount: 0,
    })
  } else {
    posts = await select(
      `SELECT uid, user_uid, category_uid, title, content, submitted, modified, hit, status 
    FROM ${table}post WHERE board_uid = ? AND status = ? AND uid ${direction} ? ORDER BY uid ${ordering} LIMIT ?`,
      [
        param.boardUid.toString(),
        CONTENT_STATUS.NORMAL.toString(),
        param.sinceUid.toString(),
        param.bunch.toString(),
      ],
    )
  }

  let result: GridItem[] = []
  for (const post of posts) {
    const info = await getPostRelated({
      uid: post.uid,
      writerUid: post.user_uid,
      viewerUid: param.accessUserUid,
      categoryUid: post.category_uid,
    })

    const { files, thumbnails } = await getPhotoItems(post.uid)

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
