/**
 * router/admin.ts
 *
 * 관리자 전용 라우팅(경로 지정) 설정
 */

const PREFIX = process.env.PREFIX || ""

export const adminRoutes = [
  {
    path: PREFIX + "/admin",
    name: "admin",
    component: () => import("@/pages/admin/AdminHome.vue"),
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
    path: PREFIX + "/admin/member",
    name: "adminMember",
    component: () => import("@/pages/admin/MemberList.vue"),
  },
  {
    path: PREFIX + "/admin/member/:uid",
    name: "adminMemberManager",
    component: () => import("@/pages/admin/MemberManager.vue"),
  },
]
