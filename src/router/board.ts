/**
 * router/board.ts
 *
 * 게시판 관련 라우팅(경로 지정) 설정
 */

const PREFIX = process.env.PREFIX || ""

export const boardRoutes = [
  {
    path: PREFIX + "/board/:id",
    name: "boardList",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: PREFIX + "/board/:id/list/:page(\\d+)",
    name: "boardListPage",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: PREFIX + "/board/:id/subject/:subject/:page(\\d+)",
    name: "boardListSubject",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: PREFIX + "/board/:id/content/:content/:page(\\d+)",
    name: "boardListContent",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: PREFIX + "/board/:id/category/:category/:page(\\d+)",
    name: "boardListCategory",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: PREFIX + "/board/:id/tag/:tag/:page(\\d+)",
    name: "boardListTag",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: PREFIX + "/board/:id/writer/:writer/:page(\\d+)",
    name: "boardListWriter",
    component: () => import("@/pages/board/List.vue"),
  },
  {
    path: PREFIX + "/board/:id/:no(\\d+)",
    name: "boardView",
    component: () => import("@/pages/board/View.vue"),
  },
  {
    path: PREFIX + "/board/:id/write",
    name: "boardWrite",
    component: () => import("@/pages/board/Write.vue"),
  },
]
