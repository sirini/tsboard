/**
 * router/gallery.ts
 *
 * 갤러리 관련 라우팅(경로 지정) 설정
 */

export const galleryRoutes = [
  {
    path: "/gallery/:id",
    name: "galleryList",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: "/gallery/:id/list/:page(\\d+)",
    name: "galleryListPage",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: "/gallery/:id/subject/:subject/:page(\\d+)",
    name: "galleryListSubject",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: "/gallery/:id/content/:content/:page(\\d+)",
    name: "galleryListContent",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: "/gallery/:id/category/:category/:page(\\d+)",
    name: "galleryListCategory",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: "/gallery/:id/tag/:tag/:page(\\d+)",
    name: "galleryListTag",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: "/gallery/:id/writer/:writer/:page(\\d+)",
    name: "galleryListWriter",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: "/gallery/:id/:no(\\d+)",
    name: "galleryOpen",
    component: () => import("@/pages/gallery/List.vue"),
  },
  {
    path: "/gallery/:id/upload",
    name: "galleryUpload",
    component: () => import("@/pages/gallery/Upload.vue"),
  },
]
