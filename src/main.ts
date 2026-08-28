import { createPinia } from "pinia"
import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { i18n } from "./i18n"
import { setSessionExpiredHandler } from "./lib/api"
import { useAuthStore } from "./stores/auth"
import "./styles/app.css"
import "vue-sonner/style.css"

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(i18n)
app.use(router)

setSessionExpiredHandler(async () => {
  useAuthStore().expire()
  const route = router.currentRoute.value
  if (route.name === "login") return
  await router.push({ name: "login", query: { redirect: route.fullPath, expired: "1" } })
})

app.mount("#app")
