import { RouteRecordRaw } from "vue-router"
import { TSBOARD } from "../../tsboard.config"

export const tradeRoutes: Array<RouteRecordRaw> = [
  {
    path: `${TSBOARD.PREFIX}/trade/:id`,
    name: "tradeList",
    component: () => import("@/pages/trade/List.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/trade/:id/:no(\\d+)`,
    name: "tradeView",
    component: () => import("@/pages/trade/View.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/trade/:id/write`,
    name: "tradeWrite",
    component: () => import("@/pages/trade/Write.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/trade/:id/write/:no(\\d+)`,
    name: "tradeModify",
    component: () => import("@/pages/trade/Write.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/trade/:id/page/:page(\\d+)`,
    name: "tradePaging",
    component: () => import("@/pages/trade/List.vue"),
  },
]
