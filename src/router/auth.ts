/**
 * router/auth.ts
 *
 * 로그인 등 회원 정보 관련 라우팅(경로 지정) 설정
 */

export const authRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/auth/Login.vue"),
  },
  {
    path: "/logout",
    name: "logout",
    component: () => import("@/pages/auth/Logout.vue"),
  },
  {
    path: "/resetpassword",
    name: "resetpassword",
    component: () => import("@/pages/auth/ResetPassword.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/pages/auth/Signup.vue"),
  },
]
