/**
 * server/util/tools
 *
 * 서버단에서 활용할 함수들 정의
 */

import { rmdir, readdir, unlink, stat } from "node:fs/promises"
import { join } from "node:path"
import { exists, mkdir } from "node:fs/promises"
import { customAlphabet } from "nanoid"
import sharp from "sharp"
import { t } from "elysia"
import exifr from "exifr"
import sanitizeHtml from "sanitize-html"
import { Exif } from "../../src/interface/gallery"
import { EXIF_APERTURE_FACTOR, EXIF_EXPOSURE_FACTOR, INIT_EXIF } from "../database/board/const"

// 헤더 쿠키 유효성 체크하는 코드
export const DEFAULT_TYPE_CHECK = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

// 사용자 고유 번호까지 같이 체크
export const EXTEND_TYPE_CHECK = {
  ...DEFAULT_TYPE_CHECK,
  query: t.Object({
    userUid: t.Numeric(),
  }),
}

// 사용자 입력에 대한 필터 설정
export const DEFAULT_HTML_FILTER = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "iframe"]),
  allowedAttributes: {
    code: ["class", "style"],
    img: ["src", "alt", "class", "title", "width", "height", "style"],
    span: ["class", "style"],
    a: ["href", "name", "title", "style"],
    iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
  },
  selfClosing: ["img", "br", "hr"],
  allowIFrameHostname: ["www.youtube.com", "youtube.com"],
  exclusiveFilter: function (frame: any) {
    return frame.tag === "iframe" && !frame.attribs.src.includes("youtube.com")
  },
}

// 랜덤 문자 6개 반환하는 함수, 인증 코드로 활용한다
export function generateRandomCode() {
  const customId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz")
  return customId(6)
}

interface Date {
  year: string
  month: string
  day: string
  hour: string
  minute: string
  second: string
}

// 현재 시간을 연월일시분초 형태 객체로 반환
export function generateDate(originDate?: number): Date {
  let date = new Date()
  if (originDate) {
    date = new Date(originDate)
  }
  const result: Date = {
    year: date.getFullYear().toString(),
    month: ("0" + (date.getMonth() + 1)).slice(-2),
    day: ("0" + date.getDate()).slice(-2),
    hour: ("0" + date.getHours()).slice(-2),
    minute: ("0" + date.getMinutes()).slice(-2),
    second: ("0" + date.getSeconds()).slice(-2),
  }
  return result
}

interface Result<T> {
  success: boolean
  error: string
  result: T
}

// Elysia 실패 메시지 리턴
export function fail<T>(error: string, result: T): Result<T> {
  return {
    success: false,
    error,
    result,
  }
}

// Elysia 성공 메시지 리턴
export function success<T>(result: T): Result<T> {
  return {
    success: true,
    error: "",
    result,
  }
}

// 주어진 파일 경로가 유효한지 확인하고 삭제하기
export async function removeFile(path: string): Promise<boolean> {
  const filepath = Bun.file(path)
  if ((await filepath.exists()) === true) {
    await unlink(path)
    return true
  }
  return false
}

// 주어진 디렉토리 경로에 빈 디렉토리들을 제거하기
export async function removeEmptyDir(directory: string): Promise<void> {
  const files = await readdir(directory)
  if (files.length > 0) {
    await Promise.all(
      files.map((file) => {
        const fullPath = join(directory, file)
        return stat(fullPath).then((stats) => {
          if (stats.isDirectory()) {
            return removeEmptyDir(fullPath)
          }
        })
      }),
    )

    const filesAfter = await readdir(directory)
    if (filesAfter.length == 0) {
      await rmdir(directory)
    }
  } else {
    await rmdir(directory)
  }
}

// 업로드된 파일을 임시 경로에 잠깐 저장하기
export async function saveUploadedFile(file: File, dirPath: string): Promise<string> {
  await makeDirectory(dirPath)
  const savedPath = `${dirPath}/${file.name}`
  await Bun.write(savedPath, file)
  return savedPath
}

// 주어진 폴더 경로를 생성하기
export async function makeDirectory(recursivePath: string): Promise<void> {
  if ((await exists(recursivePath)) === false) {
    await mkdir(recursivePath, { recursive: true })
  }
}

// 파일 저장 경로 만들기
export async function makeSavePath(target: string): Promise<string> {
  const date = generateDate()
  const savePath = `./upload/${target}/${date.year}/${date.month}/${date.day}`
  await makeDirectory(savePath)
  return savePath
}

// 파일이 경로에 존재하는지 확인
export async function isValidFile(path: string): Promise<boolean> {
  const file = Bun.file(path)
  return await file.exists()
}

// 이미지 리사이즈하기
export async function resizeImage(
  inputPath: string,
  outputPath: string,
  width: number,
): Promise<void> {
  await sharp(inputPath, { failOn: "truncated" })
    .resize({ width })
    .rotate()
    .withMetadata()
    .toFormat("avif", {
      quality: 90,
    })
    .toFile(outputPath)
}

// EXIF 정보 추출해서 반환하기
export async function exif(path: string): Promise<Exif> {
  let result: Exif = INIT_EXIF
  try {
    const exif = await exifr.parse(path)
    result = {
      make: exif.Make || "",
      model: exif.Model || "",
      aperture: (exif.FNumber || 0) * EXIF_APERTURE_FACTOR,
      iso: exif.ISO || 0,
      focalLength: exif.FocalLengthIn35mmFormat || 0,
      exposure: (exif.ExposureTime || 0) * EXIF_EXPOSURE_FACTOR,
      width: exif.ExifImageWidth || exif.ImageWidth || 0,
      height: exif.ExifImageHeight || exif.ImageHeight || 0,
      date: exif.CreateDate.getTime() || Date.now(),
    }
  } catch (e) {
    // do nothing
  } finally {
    return result
  }
}

// 순수한 (소문자) 텍스트만 남기기
export function refineText(text: string): string {
  let result = text.trim().toLowerCase()
  result = result.replaceAll(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/ ]/gim, "")
  return result
}
