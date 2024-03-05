/**
 * router/gallery
 *
 * 갤러리 관련 라우팅(경로 지정) 설정
 */

import { RouteRecordRaw } from "vue-router"

const PREFIX = process.env.PREFIX || ""

export const galleryRoutes: Array<RouteRecordRaw> = [
  {
    path: PREFIX + "/gallery/:id",
    name: "galleryList",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: PREFIX + "/gallery/:id/list/:page(\\d+)",
    name: "galleryListPage",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: PREFIX + "/gallery/:id/:no(\\d+)",
    name: "galleryOpen",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: PREFIX + "/gallery/:id/upload",
    name: "galleryUpload",
    component: () => import("@/pages/gallery/Upload.vue"),
  },
]
