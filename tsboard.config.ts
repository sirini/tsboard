/**
 * tsboard.config
 *
 * TSBOARD 기본 설정 파일
 */

export const TSBOARD = {
  IS_DEVELOPING: false /* 개발중일 때 true */,
  VERSION: "v0.8.14",
  SITE: {
    NAME: "tsboard.dev" /* 수정 필요 */,
    URL: "https://tsboard.dev" /* 수정 필요 */,
    TSBOARD_PATH: "/",
  },
  PREFIX: "",
  PORT: {
    VITE: 3000,
    DEVELOPING: 3200,
    PRODUCTION: 3100 /* 가급적 수정하지 마세요 */,
  },
  MAX_FILE_SIZE: 51238400 /* bytes, nginx 웹서버의 경우 client_max_body_size 값과 같거나 작아야 함 */,
  IMAGE: {
    PROFILE_SIZE: 256 /* px */,
    CONTENT_INSERT_SIZE: 480 /* px */,
    THUMBNAIL_SIZE: 504 /* px */,
    FULL_SIZE: 2016 /* px, for gallery */,
  },
  JWT: {
    ACCESS_TIMEOUT: 30 /* minutes */,
    REFRESH_TIMEOUT: 14 /* day */,
  },
  COOKIE: {
    HTTP_ONLY: true,
    SECURE: false,
  },
  API: {
    DEVELOPING: "http://localhost" /* 기본 http://localhost */,
    PRODUCTION: "https://tsboard.dev" /* 수정 필요 */,
  },
  /* 새 게시판 생성시 기본값 */
  BOARD: {
    ADMIN: 1 /* admin user uid */,
    TYPE: 0 /* 0: 게시판, 1: 갤러리, 2: 블로그, 3: 쇼핑몰 */,
    NAME: "새로운 게시판",
    INFO: "새 게시판 설명",
    ROW: 20,
    WIDTH: 1000,
    USE_CATEGORY: 1,
    LEVEL: {
      LIST: 0,
      VIEW: 0,
      WRITE: 1,
      COMMENT: 1,
      DOWNLOAD: 1,
    },
    POINT: {
      VIEW: 0,
      WRITE: 5,
      COMMENT: 2,
      DOWNLOAD: -10,
    },
  },
  /* 새 회원 생성시 기본값 */
  MEMBER: {
    LEVEL: 1,
    POINT: 100,
  },
  /* 기기별 스크린 가로폭 기준값 정의 (px) */
  SCREEN: {
    MOBILE: { WIDTH: 480, COLS: 12 },
    TABLET: { WIDTH: 768, COLS: 6 },
    PC: { WIDTH: 1024, COLS: 4 },
    LARGE: { WIDTH: 1440, COLS: 3 },
  },
}
Object.freeze(TSBOARD)
