/**
 * router/home.ts
 *
 * 메인 페이지 등 일반 페이지 관련 라우팅(경로 지정) 설정
 */

export const homeRoutes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/home/HomePage.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/pages/home/About.vue"),
  },
  {
    path: "/bugreport",
    name: "bugReport",
    beforeEnter: () => {
      location.href='https://github.com/sirini/tsboard/issues'
    },
    component: () => import("@/pages/home/HomePage.vue"),
  }
]