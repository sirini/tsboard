/**
 * router/gallery.ts
 *
 * 갤러리 관련 라우팅(경로 지정) 설정
 */

export const galleryRoutes = [
  {
    path: "/gallery/:id",
    name: "gallery",
    component: () => import("@/pages/gallery/Grid.vue"),
  },
  {
    path: "/gallery/:id/:no(\\d+)",
    name: "galleryOpen",
    component: () => import("@/pages/gallery/Open.vue"),
  },
  {
    path: "/gallery/:id/upload",
    name: "galleryUpload",
    component: () => import("@/pages/gallery/Upload.vue"),
  },
]