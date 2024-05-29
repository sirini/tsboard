/**
 * server/routers/sitemap
 *
 * SEO 최적화를 위한 사이트맵 생성, robots.txt 에서 경로 지정이 되어야 함.
 */

import { Elysia } from "elysia"
import { TSBOARD } from "../../tsboard.config"
import { select, table } from "../database/common"
import { generateDate } from "../util/tools"

export const sitemap = new Elysia().get("/sitemap.xml", async ({ set }) => {
  set.headers["Content-Type"] = "application/xml"

  const date = generateDate()
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${TSBOARD.API.URI}</loc><changefreq>daily</changefreq><priority>1.0</priority><lastmod>${date.year}-${date.month}-${date.day}</lastmod></url>
  <url><loc>${TSBOARD.API.URI}/about</loc><changefreq>monthly</changefreq><priority>0.3</priority><lastmod>${date.year}-${date.month}-${date.day}</lastmod></url>
  <url><loc>${TSBOARD.API.URI}/policy</loc><changefreq>monthly</changefreq><priority>0.3</priority><lastmod>${date.year}-${date.month}-${date.day}</lastmod></url>`

  const boards = await select(`SELECT id FROM ${table}board`)
  for (const board of boards) {
    xml += `<url><loc>${TSBOARD.API.URI}/board/${board.id}</loc><changefreq>daily</changefreq><priority>1.0</priority><lastmod>${date.year}-${date.month}-${date.day}</lastmod></url>`
  }
  xml += "</urlset>"

  return xml
})
