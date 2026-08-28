import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { toast } from "vue-sonner"
import { authApi, updateProfile } from "@/api/auth"
import { ApiHttpError } from "@/lib/api"
import { recoverChars } from "@/lib/utils"
import { EMPTY_USER, type CurrentUser } from "@/types/user"

export const useAuthStore = defineStore("auth", () => {
  const user = ref<CurrentUser>({ ...EMPTY_USER })
  const initialized = ref(false)
  const loading = ref(false)
  const isLoggedIn = computed(() => user.value.uid > 0)
  const isAdmin = computed(() => user.value.admin || user.value.uid === 1)

  const normalize = (value: CurrentUser) => ({
    ...value,
    name: recoverChars(value.name),
    signature: recoverChars(value.signature),
  })

  const initialize = async () => {
    if (initialized.value) return
    try {
      const response = await authApi.load()
      if (response.success) user.value = normalize(response.result)
    } catch (error) {
      if (!(error instanceof ApiHttpError) || error.status !== 401) console.error(error)
    } finally {
      initialized.value = true
    }
  }

  const login = async (id: string, password: string) => {
    loading.value = true
    try {
      const response = await authApi.signin(id, password)
      if (!response.success) {
        toast.error(response.error || "Email or password is incorrect.")
        return false
      }
      user.value = normalize(response.result)
      toast.success(`Welcome back, ${user.value.name}.`)
      return true
    } catch (error) {
      toast.error(`Sign in failed: ${String(error)}`)
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      user.value = { ...EMPTY_USER }
      toast.success("You are signed out.")
    }
  }

  const expire = () => {
    user.value = { ...EMPTY_USER }
  }

  const refreshProfile = async () => {
    const response = await authApi.load()
    if (response.success) user.value = normalize(response.result)
  }

  const saveProfile = async (input: {
    name: string
    signature: string
    password: string
    profile: File | null
  }) => {
    loading.value = true
    try {
      const response = await updateProfile(input)
      if (!response.success) {
        toast.error(response.error)
        return false
      }
      await refreshProfile()
      toast.success("Profile updated.")
      return true
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    initialized,
    loading,
    isLoggedIn,
    isAdmin,
    initialize,
    login,
    logout,
    expire,
    refreshProfile,
    saveProfile,
  }
})
