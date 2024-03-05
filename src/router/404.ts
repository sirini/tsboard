/**
 * router/404
 *
 * 잘못된 경로로 접근했을 때 Not found 라우팅 설정
 */

import { RouteRecordRaw } from "vue-router"

const PREFIX = process.env.PREFIX || ""

export const notFoundRoute: Array<RouteRecordRaw> = [
  {
    path: PREFIX + "/404",
    name: "notFound",
    component: () => import("@/pages/home/NotFound.vue"),
  },
  {
    path: PREFIX + "/:pathMatch(.*)*",
    redirect: PREFIX + "/404",
  },
]
