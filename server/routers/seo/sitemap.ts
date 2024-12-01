import { Elysia } from "elysia"
import { TSBOARD } from "../../../tsboard.config"
import { select, table } from "../../database/common"
import { generateDate } from "../../util/tools"

export const sitemapRouter = new Elysia().group("/seo", (app) => {
  return app
    .get("/sitemap.xml", async ({ set }) => {
      set.headers["Content-Type"] = "application/xml"

      const date = generateDate()
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>${TSBOARD.API.URI}/tsapi/seo/main.html</loc><changefreq>daily</changefreq><priority>1.0</priority><lastmod>${date.year}-${date.month}-${date.day}</lastmod></url>
      <url><loc>${TSBOARD.API.URI}/tsapi/seo/about.html</loc><changefreq>monthly</changefreq><priority>0.3</priority><lastmod>${date.year}-${date.month}-${date.day}</lastmod></url>`

      const boards = await select(`SELECT id FROM ${table}board`)
      for (const board of boards) {
        xml += `<url><loc>${TSBOARD.API.URI}/board/${board.id}</loc><changefreq>daily</changefreq><priority>1.0</priority><lastmod>${date.year}-${date.month}-${date.day}</lastmod></url>`
      }
      xml += "</urlset>"

      return xml
    })
})
