/**
 * server/database/board/gallery
 *
 * 갤러리 동작에 필요한 함수들
 */

import { RowDataPacket } from "mysql2"
import { PhotoItemParams, PostParams } from "../../../src/interface/board"
import { Exif, GridItem } from "../../../src/interface/gallery"
import { table, select } from "../common"
import {
  PAGING_DIRECTION,
  CONTENT_STATUS,
  EXIF_APERTURE_FACTOR,
  EXIF_EXPOSURE_FACTOR,
  INIT_EXIF,
} from "./const"
import { getPostRelated, getSearchedPosts } from "./list"

// 사진들 가져오기
export async function getPhotoItems(postUid: number): Promise<PhotoItemParams> {
  let images: PhotoItemParams = {
    files: [] as string[],
    thumbnails: [] as string[],
    exifs: [] as Exif[],
  }

  const thumbs = await select(
    `SELECT file_uid, path, full_path FROM ${table}file_thumbnail WHERE post_uid = ?`,
    [postUid.toString()],
  )

  for (const thumb of thumbs) {
    images.thumbnails.push(thumb.path)
    images.files.push(thumb.full_path)

    const [exif] = await select(
      `SELECT make, model, aperture, iso, focal_length, exposure, width, height, date FROM ${table}exif WHERE file_uid = ? LIMIT 1`,
      [thumb.file_uid],
    )

    if (exif) {
      images.exifs.push({
        make: exif.make,
        model: exif.model,
        aperture: exif.aperture / EXIF_APERTURE_FACTOR,
        iso: exif.iso,
        focalLength: exif.focal_length,
        exposure: exif.exposure / EXIF_EXPOSURE_FACTOR,
        width: exif.width,
        height: exif.height,
        date: exif.date,
      })
    } else {
      images.exifs.push(INIT_EXIF)
    }
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

    const photos = await getPhotoItems(post.uid as number)

    result.push({
      uid: post.uid,
      writer: info.writer,
      files: photos.files,
      thumbnails: photos.thumbnails,
      like: info.like,
      liked: info.liked,
      reply: info.reply,
    })
  }

  return result
}
