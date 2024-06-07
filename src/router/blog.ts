/**
 * router/blog
 *
 * 블로그 관련 라우팅(경로 지정) 설정
 */

import { RouteRecordRaw } from "vue-router"
import { TSBOARD } from "../../tsboard.config"

export const blogRoutes: Array<RouteRecordRaw> = [
  {
    path: TSBOARD.PREFIX + "/blog/:id",
    name: "blogList",
    component: () => import("@/pages/blog/List.vue"),
  },
  {
    path: TSBOARD.PREFIX + "/blog/:id/:no(\\d+)",
    name: "blogView",
    component: () => import("@/pages/blog/View.vue"),
  },
  {
    path: TSBOARD.PREFIX + "/blog/:id/write",
    name: "blogWrite",
    component: () => import("@/pages/blog/Write.vue"),
  },
  {
    path: TSBOARD.PREFIX + "/blog/:id/write/:no(\\d+)",
    name: "blogModify",
    component: () => import("@/pages/blog/Write.vue"),
  },
]
