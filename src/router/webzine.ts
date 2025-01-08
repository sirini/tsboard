import { RouteRecordRaw } from "vue-router"
import { TSBOARD } from "../../tsboard.config"

export const webzineRoutes: Array<RouteRecordRaw> = [
  {
    path: `${TSBOARD.PREFIX}/webzine/:id`,
    name: "webzineList",
    component: () => import("@/pages/webzine/List.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/webzine/:id/:no(\\d+)`,
    name: "webzineView",
    component: () => import("@/pages/webzine/View.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/webzine/:id/write`,
    name: "webzineWrite",
    component: () => import("@/pages/board/Write.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/webzine/:id/write/:no(\\d+)`,
    name: "webzineModify",
    component: () => import("@/pages/board/Write.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/webzine/:id/page/:page(\\d+)`,
    name: "webzinePaging",
    component: () => import("@/pages/webzine/List.vue"),
  },
]
