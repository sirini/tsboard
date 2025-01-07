import { RouteRecordRaw } from "vue-router"
import { TSBOARD } from "../../tsboard.config"

export const notFoundRoute: Array<RouteRecordRaw> = [
  {
    path: `${TSBOARD.PREFIX}/404`,
    name: "notFound",
    component: () => import("@/pages/home/NotFound.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/:pathMatch(.*)*`,
    redirect: TSBOARD.PREFIX + "/404",
  },
]
