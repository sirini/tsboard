import { Elysia } from "elysia"
import { getSidebarLinks } from "../../database/home/sidebar"
import { success } from "../../util/tools"

export const sidebarRouter = new Elysia().get("/sidebar/links", async () => {
  const links = await getSidebarLinks()
  return success(links)
})
