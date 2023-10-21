/**
 * router/admin.ts
 *
 * 관리자 전용 라우팅(경로 지정) 설정
 */

export const adminRoutes = [
  {
    path: "/admin/board",
    name: "adminBoard",
    component: () => import("@/pages/admin/BoardList.vue"),
  },
  {
    path: "/admin/board/:id",
    name: "adminBoardManager",
    component: () => import("@/pages/admin/BoardManager.vue"),
  },
  {
    path: "/admin/gallery",
    name: "adminGallery",
    component: () => import("@/pages/admin/GalleryList.vue")
  },
  {
    path: "/admin/gallery/:id",
    name: "adminGalleryManager",
    component: () => import("@/pages/admin/GalleryManager.vue"),
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