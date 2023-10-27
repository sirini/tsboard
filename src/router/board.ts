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
