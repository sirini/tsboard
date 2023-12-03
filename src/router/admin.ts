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
    path: PREFIX + "/admin/member/:id",
    name: "adminMemberManager",
    component: () => import("@/pages/admin/MemberManager.vue"),
  },
  {
    path: PREFIX + "/admin/report",
    name: "adminReport",
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
