/**
 * router/index.ts
 *
 * 라우팅(경로 지정) 설정
 */

import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/",
    name: "main",
    component: () => import("@/pages/MainPage.vue"),
  },
  {
    path: "/board/:id",
    name: "list",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: "/board/:id/:no(\\d+)",
    name: "view",
    component: () => import("@/pages/board/View.vue"),
  },
  {
    path: "/board/:id/write",
    name: "write",
    component: () => import("@/pages/board/Write.vue"),
  },
  {
    path: "/gallery/:id",
    name: "grid",
    component: () => import("@/pages/gallery/Grid.vue"),
  },
  {
    path: "/gallery/:id/:no(\\d+)",
    name: "open",
    component: () => import("@/pages/gallery/Open.vue"),
  },
  {
    path: "/gallery/:id/upload",
    name: "upload",
    component: () => import("@/pages/gallery/Upload.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/auth/Login.vue"),
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

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
