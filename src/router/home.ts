/**
 * router/home
 *
 * 메인 페이지 등 일반 페이지 관련 라우팅(경로 지정) 설정
 */

const PREFIX = process.env.PREFIX || ""

export const homeRoutes = [
  {
    path: PREFIX + "/",
    name: "home",
    component: () => import("@/pages/home/HomePage.vue"),
  },
  {
    path: PREFIX + "/about",
    name: "about",
    component: () => import("@/pages/home/About.vue"),
  },
  {
    path: PREFIX + "/bugreport",
    name: "bugReport",
    beforeEnter: () => {
      location.href = "https://github.com/sirini/tsboard/issues"
    },
    component: () => import("@/pages/home/HomePage.vue"),
  },
  {
    path: PREFIX + "/tsboard",
    name: "tsboard",
    beforeEnter: () => {
      location.href = "https://tsboard.dev"
    },
    component: () => import("@/pages/home/HomePage.vue"),
  },
  {
    path: PREFIX + "/learn/typescript",
    name: "typescript",
    beforeEnter: () => {
      location.href = "https://www.typescriptlang.org/ko/"
    },
    component: () => import("@/pages/home/HomePage.vue"),
  },
  {
    path: PREFIX + "/learn/vue",
    name: "vue",
    beforeEnter: () => {
      location.href = "https://ko.vuejs.org/"
    },
    component: () => import("@/pages/home/HomePage.vue"),
  },
  {
    path: PREFIX + "/learn/vuetify",
    name: "vuetify",
    beforeEnter: () => {
      location.href = "https://vuetifyjs.com/en/introduction/why-vuetify/#what-is-vuetify3f"
    },
    component: () => import("@/pages/home/HomePage.vue"),
  },
  {
    path: PREFIX + "/learn/bun",
    name: "bun",
    beforeEnter: () => {
      location.href = "https://bun.sh/"
    },
    component: () => import("@/pages/home/HomePage.vue"),
  },
  {
    path: PREFIX + "/learn/elysia",
    name: "elysia",
    beforeEnter: () => {
      location.href = "https://elysiajs.com/"
    },
    component: () => import("@/pages/home/HomePage.vue"),
  },
]
