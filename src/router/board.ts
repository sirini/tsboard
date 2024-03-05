/**
 * router/board
 *
 * 게시판 관련 라우팅(경로 지정) 설정
 */

import { RouteRecordRaw } from "vue-router"

const PREFIX = process.env.PREFIX || ""

export const boardRoutes: Array<RouteRecordRaw> = [
  {
    path: PREFIX + "/board/:id",
    name: "boardList",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: PREFIX + "/board/:id/list/:page(\\d+)",
    name: "boardListPage",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: PREFIX + "/board/:id/:no(\\d+)",
    name: "boardView",
    component: () => import("@/pages/board/View.vue"),
  },
  {
    path: PREFIX + "/board/:id/write",
    name: "boardWrite",
    component: () => import("@/pages/board/Write.vue"),
  },
]
