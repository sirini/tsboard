/**
 * router/home
 *
 * 메인 페이지 등 일반 페이지 관련 라우팅(경로 지정) 설정
 */

import { RouteRecordRaw } from "vue-router"
import { TSBOARD } from "../../tsboard.config"

export const homeRoutes: Array<RouteRecordRaw> = [
  {
    path: `${TSBOARD.PREFIX}/`,
    name: "home",
    component: () => import("@/pages/home/HomePage.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/about`,
    name: "about",
    component: () => import("@/pages/home/About.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/license`,
    name: "license",
    component: () => import("@/pages/home/License.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/policy`,
    name: "policy",
    component: () => import("@/pages/home/Policy.vue"),
  },
]
