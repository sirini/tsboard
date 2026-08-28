import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { toast } from "vue-sonner"
import { homeApi } from "@/api/home"
import type { HomeGroup, NotificationItem } from "@/types/content"
import { useAuthStore } from "./auth"

const VISIT_KEY = "tsboard-visit-date"

export const useHomeStore = defineStore("home", () => {
  const auth = useAuthStore()
  const groups = ref<HomeGroup[]>([])
  const notifications = ref<NotificationItem[]>([])
  const menuLoading = ref(false)
  const notificationLoading = ref(false)
  const unreadCount = computed(() => notifications.value.filter((item) => !item.checked).length)

  const loadMenus = async () => {
    if (groups.value.length || menuLoading.value) return
    menuLoading.value = true
    try {
      const response = await homeApi.menus()
      if (response.success) groups.value = response.result
    } catch (error) {
      console.error("Could not load board navigation", error)
    } finally {
      menuLoading.value = false
    }
  }

  const visit = async () => {
    const today = new Date().toISOString().slice(0, 10)
    if (localStorage.getItem(VISIT_KEY) === today) return
    try {
      await homeApi.visit(auth.user.uid || undefined)
    } finally {
      localStorage.setItem(VISIT_KEY, today)
    }
  }

  const loadNotifications = async () => {
    if (!auth.isLoggedIn) return
    notificationLoading.value = true
    try {
      const response = await homeApi.notifications()
      if (response.success) notifications.value = response.result
    } catch (error) {
      toast.error(`Notifications could not be loaded: ${String(error)}`)
    } finally {
      notificationLoading.value = false
    }
  }

  const markAllRead = async () => {
    const response = await homeApi.checkNotifications()
    if (response.success) notifications.value.forEach((item) => (item.checked = true))
  }

  const markRead = async (uid: number) => {
    const item = notifications.value.find((entry) => entry.uid === uid)
    if (item?.checked) return
    const response = await homeApi.checkNotification(uid)
    if (response.success && item) item.checked = true
  }

  return {
    groups,
    notifications,
    menuLoading,
    notificationLoading,
    unreadCount,
    loadMenus,
    visit,
    loadNotifications,
    markAllRead,
    markRead,
  }
})
