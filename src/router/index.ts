/**
 * router/index.ts
 *
 * 라우팅(경로 지정) 설정
 */

import { createRouter, createWebHistory } from "vue-router"
import { boardRoutes } from "./board"
import { galleryRoutes } from "./gallery"
import { authRoutes } from "./auth"
import { pageRoutes } from "./page"

const routes = [
  ...pageRoutes,
  ...authRoutes,
  ...boardRoutes,
  ...galleryRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
