/**
 * server/routers/home/sidebar
 *
 * 웹사이트 사이트바에 필요한 라우팅
 */

import { Elysia } from "elysia"
import { success } from "../../util/tools"
import { getSidebarLinks } from "../../database/home/sidebar"

export const sidebar = new Elysia().get("/sidebar/links", async () => {
  const links = await getSidebarLinks()
  return success(links)
})
