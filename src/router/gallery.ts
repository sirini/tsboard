/**
 * router/gallery
 *
 * 갤러리 관련 라우팅(경로 지정) 설정
 */

const PREFIX = process.env.PREFIX || ""

export const galleryRoutes = [
  {
    path: PREFIX + "/gallery/:id",
    name: "galleryList",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: PREFIX + "/gallery/:id/list/:page(\\d+)",
    name: "galleryListPage",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: PREFIX + "/gallery/:id/subject/:subject/:page(\\d+)",
    name: "galleryListSubject",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: PREFIX + "/gallery/:id/content/:content/:page(\\d+)",
    name: "galleryListContent",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: PREFIX + "/gallery/:id/category/:category/:page(\\d+)",
    name: "galleryListCategory",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: PREFIX + "/gallery/:id/tag/:tag/:page(\\d+)",
    name: "galleryListTag",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: PREFIX + "/gallery/:id/writer/:writer/:page(\\d+)",
    name: "galleryListWriter",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: PREFIX + "/gallery/:id/:no(\\d+)",
    name: "galleryOpen",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: PREFIX + "/gallery/:id/upload",
    name: "galleryUpload",
    component: () => import("@/pages/gallery/Upload.vue"),
  },
]
