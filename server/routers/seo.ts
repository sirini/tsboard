import { Elysia } from "elysia"
import { aboutRouter } from "./seo/about"
import { mainRouter } from "./seo/main"
import { sitemapRouter } from "./seo/sitemap"

export const seoRouter = new Elysia().group("/seo", (app) => {
  return app.use(mainRouter).use(aboutRouter).use(sitemapRouter)
})
