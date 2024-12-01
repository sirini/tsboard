/**
 * server/routers/blog
 *
 * 블로그 관련 처리
 */

import { Elysia } from "elysia"
import { TSBOARD } from "../../tsboard.config"
import { CONTENT_STATUS } from "../database/board/const"
import { getBoardConfig } from "../database/board/list"
import { select, table } from "../database/common"

function dateForRSS(date: Date) {
  const utcString = date.toUTCString()
  return utcString.replace("GMT", "+0000")
}

function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, "")
}

function truncateText(text: string, maxLength: number = 200) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "..."
  } else {
    return text
  }
}

export const blogRssRouter = new Elysia().get("/rss/:id", async ({ params: { id }, set }) => {
  set.headers["Content-Type"] = "application/rss+xml; charset=UTF-8"
  const config = await getBoardConfig(id)
  const file = Bun.file("./public/blog/rss.template.xml")
  let rss = await file.text()

  if (config.uid < 1) {
    return `<error>Invalid board id.</error>`
  }

  let latestDate: Date | null = null
  let items = ""

  const posts = await select(
    `SELECT uid, user_uid, title, content, submitted FROM ${table}post WHERE board_uid = ? AND status = ? ORDER BY uid DESC LIMIT ?`,
    [config.uid.toString(), CONTENT_STATUS.NORMAL.toString(), config.rowCount.toString()],
  )

  for (const post of posts) {
    if (latestDate === null) {
      latestDate = new Date(post.submitted)
    }

    const [writer] = await select(`SELECT name FROM ${table}user WHERE uid = ? LIMIT 1`, [
      post.user_uid,
    ])

    items += `
        <item>
          <title>${post.title}</title>
          <link>${TSBOARD.API.URI}/blog/${id}/${post.uid}</link>
          <description>${truncateText(stripHTML(post.content))}</description>
          <author>${writer.name}</author>
          <pubDate>${dateForRSS(new Date(post.submitted))}</pubDate>
          <guid isPermaLink="true">${TSBOARD.API.URI}/blog/${id}/${post.uid}</guid>
        </item>`
  }

  rss = rss.replace("#BLOG.TITLE#", config.name)
  rss = rss.replace("#BLOG.LINK#", `${TSBOARD.API.URI}/blog/${id}`)
  rss = rss.replace("#BLOG.INFO#", config.info)
  rss = rss.replace("#BLOG.LANG#", "ko-kr")
  rss = rss.replaceAll("#BLOG.DATE#", dateForRSS(latestDate || new Date()))
  rss = rss.replace("#BLOG.GENERATOR#", `TSBOARD ${TSBOARD.VERSION} (tsboard.dev)`)
  rss = rss.replace("#BLOG.ITEM#", items)

  return rss
})
