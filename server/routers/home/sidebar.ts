/**
 * server/routers/home/sidebar
 *
 * 웹사이트 사이트바에 필요한 라우팅
 */

import { Elysia } from "elysia"
import { getSidebarLinks } from "../../database/home/sidebar"
import { success } from "../../util/tools"

export const sidebarRouter = new Elysia().get("/sidebar/links", async () => {
  const links = await getSidebarLinks()
  return success(links)
})
