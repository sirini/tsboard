/**
 * router/admin
 *
 * 관리자 전용 라우팅(경로 지정) 설정
 */

import { RouteRecordRaw } from "vue-router"

const PREFIX = process.env.PREFIX || ""

export const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: PREFIX + "/admin",
    name: "admin",
    component: () => import("@/pages/admin/Dashboard.vue"),
  },
  {
    path: PREFIX + "/admin/board",
    name: "adminBoardGroup",
    component: () => import("@/pages/admin/BoardGroupList.vue"),
  },
  {
    path: PREFIX + "/admin/board/group/:id",
    name: "adminBoardGroupManager",
    component: () => import("@/pages/admin/BoardGroupManager.vue"),
  },
  {
    path: PREFIX + "/admin/board/:id",
    name: "adminBoardManager",
    component: () => import("@/pages/admin/BoardManager.vue"),
  },
  {
    path: PREFIX + "/admin/user",
    name: "adminUser",
    component: () => import("@/pages/admin/UserList.vue"),
  },
  {
    path: PREFIX + "/admin/user/:no(\\d+)",
    name: "adminUserManager",
    component: () => import("@/pages/admin/UserModify.vue"),
  },
  {
    path: PREFIX + "/admin/report",
    name: "adminReport",
    component: () => import("@/pages/admin/ReportList.vue"),
  },
  {
    path: PREFIX + "/admin/report/:no(\\d+)",
    name: "adminReportView",
    component: () => import("@/pages/admin/ReportList.vue"),
  },
  {
    path: PREFIX + "/admin/latest/post",
    name: "adminLatestPost",
    component: () => import("@/pages/admin/LatestPost.vue"),
  },
  {
    path: PREFIX + "/admin/latest/comment",
    name: "adminLatestComment",
    component: () => import("@/pages/admin/LatestComment.vue"),
  },
]
