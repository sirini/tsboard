/**
 * router/page.ts
 *
 * 메인 페이지 등 일반 페이지 관련 라우팅(경로 지정) 설정
 */

export const pageRoutes = [
  {
    path: "/",
    name: "main",
    component: () => import("@/pages/MainPage.vue"),
  },
]