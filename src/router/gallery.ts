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
