export const DEV_SERVER = {
  frontendPort: 3000,
  apiHost: "127.0.0.1",
  apiPort: 3003,
} as const

export const TSBOARD = {
  version: "1.3.0",
  apiContract: "1",
  apiBase: "/goapi",
  basePath: "/",
  siteName: "TSBOARD",
  tagline: "A fast, focused community for everyone.",
  domain: "https://tsboard.dev",
  adminEmail: "sirini@gmail.com",
  uploadLimit: 100 * 1024 * 1024,
  oauth: { google: true, naver: true, kakao: true },
} as const
