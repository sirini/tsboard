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
    path: `${TSBOARD.PREFIX}/copyright`,
    name: "copyright",
    component: () => import("@/pages/home/License.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/policy`,
    name: "policy",
    component: () => import("@/pages/home/Policy.vue"),
  },
]
