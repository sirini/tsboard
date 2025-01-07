import { RouteRecordRaw } from "vue-router"
import { TSBOARD } from "../../tsboard.config"

export const blogRoutes: Array<RouteRecordRaw> = [
  {
    path: `${TSBOARD.PREFIX}/blog/:id`,
    name: "blogList",
    component: () => import("@/pages/blog/List.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/blog/:id/:no(\\d+)`,
    name: "blogView",
    component: () => import("@/pages/blog/View.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/blog/:id/write`,
    name: "blogWrite",
    component: () => import("@/pages/blog/Write.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/blog/:id/write/:no(\\d+)`,
    name: "blogModify",
    component: () => import("@/pages/blog/Write.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/blog/:id/page/:page(\\d+)`,
    name: "blogPaging",
    component: () => import("@/pages/blog/List.vue"),
  },
]
