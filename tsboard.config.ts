export const IS_DEV = true // 프로덕션에서는 false, 개발 단계에서만 true
export const VITE_PORT = 3000 // (개발용) Vite 개발용 서버 포트
export const DEV_DOMAIN = "http://localhost" // (개발용) localhost 혹은 개발중인 머신의 (IP)주소
const dev_url = `${DEV_DOMAIN}:${VITE_PORT}` // (개발용) 개발용 페이지 접속 주소 지정
const production_url = "https://tsboard.dev" // 본인 사이트의 도메인 입력

// TSBOARD 기본 설정값, ✔︎ 표기된 부분은 필요 시 수정하셔야 하는 곳입니다
export const TSBOARD = {
  API: (IS_DEV ? dev_url : production_url) + "/goapi",
  API_PORT: 3003 /* ✔︎ (.env GOAPI_PORT와 동일) */,
  MAX_UPLOAD_SIZE: 1024 * 1024 * 100 /* ✔︎ */,
  PREFIX: "" /* ✔︎ (기본: 빈 문자열) */,
  SITE: {
    HOME: {
      CATEGORIES: [
        { id: "free", limit: 8 } /* ✔︎ */,
        { id: "sirini", limit: 8 } /* ✔︎ */,
        { id: "photo", limit: 4 } /* ✔︎ */,
      ],
      COLUMNS: {
        COLS: 6 /* ✔︎ */,
        BOARDS: [
          { id: "free", limit: 10 } /* ✔︎ */,
          { id: "sirini", limit: 10 } /* ✔︎ */,
        ],
        GALLERY: { id: "photo", limit: 6 } /* ✔︎ */,
      },
    },
    MOBILE: { WRITE: "free" /* ✔︎ */, PHOTO: "photo" /* ✔︎ */ },
    NAME: "TSBOARD" /* ✔︎ */,
    OAUTH: {
      GOOGLE: true /* ✔︎ (true 시 .env OAUTH_GOOGLE_... 부분 입력 필요) */,
      NAVER: true /* ✔︎ (true 시 .env OAUTH_NAVER_... 부분 입력 필요) */,
      KAKAO: true /* ✔︎ (true 시 .env OAUTH_KAKAO_... 부분 입력 필요) */,
    },
    URL: IS_DEV ? dev_url : production_url,
  },
  VERSION: "v1.0.5",
}

// 사이트의 기본 컬러셋 지정 (필요 시 수정)
// 참고: https://vuetifyjs.com/en/styles/colors/#material-colors
export const COLOR = {
  HOME: {
    THEME: "light",
    MAIN: "#424242",
    TOOLBAR: "#424242",
    FOOTER: "#F5F5F5",
    BACKGROUND: "#F5F5F5",
  },
  ADMIN: {
    THEME: "light",
    MAIN: "#795548",
    TOOLBAR: "#EFEBE9",
    FOOTER: "#EFEBE9",
    BACKGROUND: "#EFEBE9",
  },
  BLOG: {
    THEME: "dark",
    MAIN: "#121212",
    TOOLBAR: "#121212",
    FOOTER: "#121212",
    BACKGROUND: "#121212",
  },
  GALLERY: {
    THEME: "light",
    MAIN: "#121212",
    TOOLBAR: "#121212",
    FOOTER: "#121212",
    BACKGROUND: "#121212",
  },
  COMMENT: {
    TOOLBAR: { BLOG: "#1c1c1c", HOME: "#f1f1f1", BOARD_WRITER: "#FFF3E0", BLOG_WRITER: "#121212" },
    NAMETAG: { BLOG: "#9E9E9E", HOME: "#616161", BOARD_WRITER: "#EF6C00", BLOG_WRITER: "#525252" },
  },
}

// 브라우저 크기 별 사이즈 정의 (대부분 수정 불필요)
export const SCREEN = {
  MOBILE: { WIDTH: 480, COLS: 12 },
  TABLET: { WIDTH: 768, COLS: 6 },
  PC: { WIDTH: 1024, COLS: 4 },
  LARGE: { WIDTH: 1440, COLS: 3 },
}

// EXIF 정보 가공용 상수값들 정의 (수정 금지)
export const EXIF = { APERTURE: 100, EXPOSURE: 1000 }

// 사이트 관리자/책임자 명시 (반드시 수정 필요)
export const POLICY = { NAME: "sirini", EMAIL: "sirini@gmail.com" }

// 기본 화폐 단위 (기본: 원화)
export const CURRENCY = "krw" // usb, cny, jpy, eur ...

Object.freeze(TSBOARD)
Object.freeze(COLOR)
Object.freeze(SCREEN)
Object.freeze(POLICY)
