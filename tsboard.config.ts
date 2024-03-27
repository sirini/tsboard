/**
 * tsboard.config
 *
 * TSBOARD 기본 설정 파일
 */

export const TSBOARD = {
  IS_DEVELOPING: false /* 개발중일 때 true */,
  VERSION: 0.86,
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
  MAX_FILE_SIZE: 10247680 /* bytes */,
  IMAGE: {
    PROFILE_SIZE: 256 /* px */,
    CONTENT_INSERT_SIZE: 512 /* px */,
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
    MOBILE: 480,
    TABLET: 768,
    PC: 1024,
    LARGE: 1440,
  },
}
Object.freeze(TSBOARD)
