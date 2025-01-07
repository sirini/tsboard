import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router"
import { boardRoutes } from "./board"
import { blogRoutes } from "./blog"
import { galleryRoutes } from "./gallery"
import { webzineRoutes } from "./webzine"
import { authRoutes } from "./auth"
import { homeRoutes } from "./home"
import { adminRoutes } from "./admin"
import { notFoundRoute } from "./404"

const routes: Array<RouteRecordRaw> = [
  ...homeRoutes,
  ...adminRoutes,
  ...authRoutes,
  ...boardRoutes,
  ...blogRoutes,
  ...galleryRoutes,
  ...webzineRoutes,
  ...notFoundRoute,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
