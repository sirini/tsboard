/**
 * router/auth
 *
 * 로그인, 인증 등 회원 정보 관련 라우팅(경로 지정) 설정
 */

const PREFIX = process.env.PREFIX || ""

export const authRoutes = [
  {
    path: PREFIX + "/login",
    name: "login",
    component: () => import("@/pages/auth/Login.vue"),
  },
  {
    path: PREFIX + "/logout",
    name: "logout",
    component: () => import("@/pages/auth/Logout.vue"),
  },
  {
    path: PREFIX + "/resetpassword",
    name: "resetpassword",
    component: () => import("@/pages/auth/ResetPassword.vue"),
  },
  {
    path: PREFIX + "/changepassword/:target(\\d+)/:code",
    name: "changepassword",
    component: () => import("@/pages/auth/ChangePassword.vue"),
  },
  {
    path: PREFIX + "/signup",
    name: "signup",
    component: () => import("@/pages/auth/Signup.vue"),
  },
  {
    path: PREFIX + "/myinfo",
    name: "myinfo",
    component: () => import("@/pages/auth/MyInfo.vue"),
  },
  {
    path: PREFIX + "/verify/:target(\\d+)",
    name: "verify",
    component: () => import("@/pages/auth/Verify.vue"),
  },
]
