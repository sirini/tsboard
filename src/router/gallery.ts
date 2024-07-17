/**
 * router/gallery
 *
 * 갤러리 관련 라우팅(경로 지정) 설정
 */

import { RouteRecordRaw } from "vue-router"
import { TSBOARD } from "../../tsboard.config"

export const galleryRoutes: Array<RouteRecordRaw> = [
  {
    path: `${TSBOARD.PREFIX}/gallery/:id`,
    name: "galleryList",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/gallery/:id/:no(\\d+)`,
    name: "galleryView",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/gallery/:id/write`,
    name: "galleryWrite",
    component: () => import("@/pages/board/Write.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/gallery/:id/write/:no(\\d+)`,
    name: "galleryModify",
    component: () => import("@/pages/board/Write.vue"),
  },
]
