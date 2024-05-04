/**
 * tsboard.config
 *
 * TSBOARD 기본 설정 파일
 */

export const IS_DEV = false // 개발중일 때 true 로 설정 후 저장, 프로덕션에서는 false
export const PORT_DEV_VITE = 3000
export const PORT_DEV = 3200
export const PORT_PROD = 3100
export const LOCALHOST = "http://geunyul2.asuscomm.com"
const DEV_URL = `${LOCALHOST}:${PORT_DEV_VITE}`
const PROD_URL = "https://tsboard.dev" // 본인 도메인으로 교체 필요

export const TSBOARD = {
  VERSION: "v0.8.22",
  SITE: {
    NAME: "TSBOARD" /*** 수정 필요 ***/,
    URL: IS_DEV ? DEV_URL : PROD_URL /*** 본인의 도메인으로 교체 필요 ***/,
    API_PORT: IS_DEV ? PORT_DEV : PORT_PROD,
  },
  PREFIX: "" /*** TSBOARD 설치 경로가 root 가 아닐 경우 앞쪽 경로 작성, 예: "/tsboard" */,
  API: {
    URI: IS_DEV
      ? DEV_URL
      : PROD_URL /* 쿠키가 제대로 동작하려면, API 호출은 3000(개발 시) 혹은 80(프로덕션 시) */,
  },
}

export const AUTH = {
  JWT: {
    ACCESS_TIMEOUT: 30 /* minutes */,
    REFRESH_TIMEOUT: 14 /* day */,
    OAUTH_TIMEOUT: 10 /* minutes */,
  },
  COOKIE: {
    HTTP_ONLY: true,
    SECURE: false,
  },
}

export const SIZE = {
  PROFILE: 256 /* px */,
  CONTENT_INSERT: 480 /* px */,
  THUMBNAIL: 504 /* px */,
  FULL: 2016 /* px, for gallery */,
  MAX_FILE: 21238400 /* bytes, nginx 웹서버의 경우 client_max_body_size 값과 같거나 작아야 함 */,
}

export const OAUTH = {
  IS_READY: true,
  GOOGLE: {
    REDIRECT_URI: `${IS_DEV ? DEV_URL : PROD_URL}/api/auth/google`,
    TOKEN_URI: "https://oauth2.googleapis.com/token",
    USERINFO_URI: "https://www.googleapis.com/oauth2/v2/userinfo",
    CLIENT_ID:
      "480180821950-lf6c139j2g521t2fjistepaf7ibj1586.apps.googleusercontent.com" /*** 구글 클라우드 콘솔에서 본인의 클라이언트 ID로 교체 필요 ***/,
  },
  SUCCESS_MESSAGE: "tsboardOAuthLoggedIn",
}

export const NEW_BOARD = {
  ADMIN: 1 /* admin user uid */,
  TYPE: 0 /* 0: 게시판, 1: 갤러리, 2: 블로그, 3: 쇼핑몰 */,
  NAME: "새로운 게시판",
  INFO: "새 게시판 설명",
  ROWS: 20,
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
}

export const NEW_MEMBER = {
  LEVEL: 1,
  POINT: 100,
}

export const SCREEN = {
  MOBILE: { WIDTH: 480, COLS: 12 },
  TABLET: { WIDTH: 768, COLS: 6 },
  PC: { WIDTH: 1024, COLS: 4 },
  LARGE: { WIDTH: 1440, COLS: 3 },
}

export const POLICY = {
  NAME: "sirini" /* 사이트 관리자 성함 */,
  EMAIL: "sirini@gmail.com" /* 관리자 이메일 */,
}

Object.freeze(TSBOARD)
Object.freeze(AUTH)
Object.freeze(SIZE)
Object.freeze(OAUTH)
Object.freeze(NEW_BOARD)
Object.freeze(NEW_MEMBER)
Object.freeze(SCREEN)
Object.freeze(POLICY)
