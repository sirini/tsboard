/**
 * router/board.ts
 *
 * 게시판 관련 라우팅(경로 지정) 설정
 */

export const boardRoutes = [
  {
    path: "/board/:id",
    name: "boardList",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: "/board/:id/list/:page(\\d+)",
    name: "boardListPage",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: "/board/:id/subject/:subject/:page(\\d+)",
    name: "boardListSubject",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: "/board/:id/content/:content/:page(\\d+)",
    name: "boardListContent",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: "/board/:id/category/:category/:page(\\d+)",
    name: "boardListCategory",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: "/board/:id/tag/:tag/:page(\\d+)",
    name: "boardListTag",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: "/board/:id/writer/:writer/:page(\\d+)",
    name: "boardListWriter",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: "/board/:id/:no(\\d+)",
    name: "boardView",
    component: () => import("@/pages/board/View.vue"),
  },
  {
    path: "/board/:id/write",
    name: "boardWrite",
    component: () => import("@/pages/board/Write.vue"),
  },
]
