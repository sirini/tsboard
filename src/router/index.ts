/**
 * router/index
 *
 * 라우팅(경로 지정) 설정
 */

import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router"
import { boardRoutes } from "./board"
import { galleryRoutes } from "./gallery"
import { authRoutes } from "./auth"
import { homeRoutes } from "./home"
import { adminRoutes } from "./admin"
import { notFoundRoute } from "./404"

const routes: Array<RouteRecordRaw> = [
  ...homeRoutes,
  ...adminRoutes,
  ...authRoutes,
  ...boardRoutes,
  ...galleryRoutes,
  ...notFoundRoute,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
