/**
 * router/auth
 *
 * 로그인, 인증 등 회원 정보 관련 라우팅(경로 지정) 설정
 */

import { RouteRecordRaw } from "vue-router"
import { TSBOARD } from "../../tsboard.config"

export const authRoutes: Array<RouteRecordRaw> = [
  {
    path: TSBOARD.PREFIX + "/login",
    name: "login",
    component: () => import("@/pages/auth/Login.vue"),
  },
  {
    path: TSBOARD.PREFIX + "/logout",
    name: "logout",
    component: () => import("@/pages/auth/Logout.vue"),
  },
  {
    path: TSBOARD.PREFIX + "/resetpassword",
    name: "resetpassword",
    component: () => import("@/pages/auth/ResetPassword.vue"),
  },
  {
    path: TSBOARD.PREFIX + "/changepassword/:target(\\d+)/:code",
    name: "changepassword",
    component: () => import("@/pages/auth/ChangePassword.vue"),
  },
  {
    path: TSBOARD.PREFIX + "/signup",
    name: "signup",
    component: () => import("@/pages/auth/Signup.vue"),
  },
  {
    path: TSBOARD.PREFIX + "/myinfo",
    name: "myinfo",
    component: () => import("@/pages/auth/MyInfo.vue"),
  },
  {
    path: TSBOARD.PREFIX + "/verify/:target(\\d+)",
    name: "verify",
    component: () => import("@/pages/auth/Verify.vue"),
  },
]
