import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import { TSBOARD } from "../../tsboard.config"
import { useAuthStore } from "@/stores/auth"

const routes: RouteRecordRaw[] = [
  { path: "/", name: "home", component: () => import("@/pages/HomePage.vue") },
  {
    path: "/search/:option/:keyword",
    name: "search",
    component: () => import("@/pages/HomePage.vue"),
  },
  { path: "/board/:id", name: "board", component: () => import("@/pages/board/BoardListPage.vue") },
  {
    path: "/board/:id/page/:page",
    name: "board-page",
    component: () => import("@/pages/board/BoardListPage.vue"),
  },
  {
    path: "/board/:id/search/:option/:keyword/:page",
    name: "board-search",
    component: () => import("@/pages/board/BoardListPage.vue"),
  },
  {
    path: "/board/:id/write",
    name: "board-write",
    component: () => import("@/pages/board/BoardEditorPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/board/:id/:postUid/edit",
    name: "board-edit",
    component: () => import("@/pages/board/BoardEditorPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/board/:id/:postUid",
    name: "thread",
    component: () => import("@/pages/board/ThreadPage.vue"),
  },
  { path: "/user/:userUid", name: "profile", component: () => import("@/pages/ProfilePage.vue") },
  {
    path: "/messages",
    name: "messages",
    component: () => import("@/pages/MessagesPage.vue"),
    meta: { requiresAuth: true, title: "Messages" },
  },
  { path: "/auth/login", name: "login", component: () => import("@/pages/auth/LoginPage.vue") },
  { path: "/auth/join", name: "join", component: () => import("@/pages/auth/JoinPage.vue") },
  {
    path: "/auth/reset-password",
    name: "reset-password",
    component: () => import("@/pages/auth/ResetPasswordPage.vue"),
  },
  {
    path: "/auth/change-password/:target/:code",
    name: "change-password",
    component: () => import("@/pages/auth/ChangePasswordPage.vue"),
  },
  { path: "/about", name: "about", component: () => import("@/pages/static/AboutPage.vue") },
  { path: "/terms", name: "terms", component: () => import("@/pages/static/TermsPage.vue") },
  { path: "/privacy", name: "privacy", component: () => import("@/pages/static/PrivacyPage.vue") },
  {
    path: "/admin",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAdmin: true, layout: "admin" },
    children: [
      {
        path: "",
        name: "admin-dashboard",
        component: () => import("@/pages/admin/DashboardPage.vue"),
      },
      {
        path: "boards",
        name: "admin-boards",
        component: () => import("@/pages/admin/BoardsPage.vue"),
      },
      {
        path: "users",
        name: "admin-users",
        component: () => import("@/pages/admin/UsersPage.vue"),
      },
      {
        path: "moderation",
        name: "admin-moderation",
        component: () => import("@/pages/admin/ModerationPage.vue"),
      },
      { path: "mail", name: "admin-mail", component: () => import("@/pages/admin/MailPage.vue") },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/pages/NotFoundPage.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(TSBOARD.basePath),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.initialize()
  if (to.meta.requiresAdmin && !auth.isAdmin)
    return { name: "login", query: { redirect: to.fullPath } }
  if (to.meta.requiresAuth && !auth.isLoggedIn)
    return { name: "login", query: { redirect: to.fullPath } }
})

router.afterEach((to) => {
  const label = typeof to.meta.title === "string" ? `${to.meta.title} · ` : ""
  document.title = `${label}${TSBOARD.siteName} · Community, without the weight`
})

export default router
