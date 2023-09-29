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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
