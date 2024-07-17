/**
 * router/board
 *
 * 게시판 관련 라우팅(경로 지정) 설정
 */

import { RouteRecordRaw } from "vue-router"
import { TSBOARD } from "../../tsboard.config"

export const boardRoutes: Array<RouteRecordRaw> = [
  {
    path: `${TSBOARD.PREFIX}/board/:id`,
    name: "boardList",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/board/:id/:no(\\d+)`,
    name: "boardView",
    component: () => import("@/pages/board/View.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/board/:id/write`,
    name: "boardWrite",
    component: () => import("@/pages/board/Write.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/board/:id/write/:no(\\d+)`,
    name: "boardModify",
    component: () => import("@/pages/board/Write.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/board/:id/page/:page(\\d+)`,
    name: "boardPaging",
    component: () => import("@/pages/board/List.vue"),
  },
]
