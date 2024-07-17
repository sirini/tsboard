/**
 * router/404
 *
 * 잘못된 경로로 접근했을 때 Not found 라우팅 설정
 */

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
