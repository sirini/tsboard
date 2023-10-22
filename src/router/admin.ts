/**
 * router/admin.ts
 *
 * 관리자 전용 라우팅(경로 지정) 설정
 */

export const adminRoutes = [
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/pages/admin/AdminHome.vue")
  },
  {
    path: "/admin/board",
    name: "adminBoard",
    component: () => import("@/pages/admin/BoardGroupManager.vue"),
  },
  {
    path: "/admin/board/:id",
    name: "adminBoardManager",
    component: () => import("@/pages/admin/BoardManager.vue"),
  },
  {
    path: "/admin/member",
    name: "adminMember",
    component: () => import("@/pages/admin/MemberList.vue"),
  },
  {
    path: "/admin/member/:uid",
    name: "adminMemberManager",
    component: () => import("@/pages/admin/MemberManager.vue"),
  }
]