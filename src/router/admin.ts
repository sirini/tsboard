import { RouteRecordRaw } from "vue-router"
import { TSBOARD } from "../../tsboard.config"

export const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: `${TSBOARD.PREFIX}/admin`,
    name: "admin",
    component: () => import("@/pages/admin/Dashboard.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/admin/board`,
    name: "adminBoardGroup",
    component: () => import("@/pages/admin/BoardGroupList.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/admin/board/group/:id`,
    name: "adminBoardGroupManager",
    component: () => import("@/pages/admin/BoardGroupManager.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/admin/board/:id`,
    name: "adminBoardManager",
    component: () => import("@/pages/admin/BoardManager.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/admin/user`,
    name: "adminUser",
    component: () => import("@/pages/admin/UserList.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/admin/user/:no(\\d+)`,
    name: "adminUserManager",
    component: () => import("@/pages/admin/UserModify.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/admin/report`,
    name: "adminReport",
    component: () => import("@/pages/admin/ReportList.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/admin/report/:no(\\d+)`,
    name: "adminReportView",
    component: () => import("@/pages/admin/ReportList.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/admin/latest/post`,
    name: "adminLatestPost",
    component: () => import("@/pages/admin/LatestPost.vue"),
  },
  {
    path: `${TSBOARD.PREFIX}/admin/latest/comment`,
    name: "adminLatestComment",
    component: () => import("@/pages/admin/LatestComment.vue"),
  },
]
