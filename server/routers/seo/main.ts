import { Elysia } from "elysia"
import { SEO, TSBOARD } from "../../../tsboard.config"
import { getComments, getMaxCommentUid } from "../../database/board/comment"
import { BOARD_TYPE, PAGING_DIRECTION } from "../../database/board/const"
import { getTags } from "../../database/board/view"
import { getLatestPost, getMaxUid } from "../../database/home/list"
import { generateDate } from "../../util/tools"

export const mainRouter = new Elysia().group("/seo", (app) => {
  return app
    .get("/main.html", async ({ set }) => {
      set.headers["Content-Type"] = "text/html"
      const file = Bun.file("./public/seo/template/main.html")
      let text = await file.text()
      text = text.replaceAll("#TSBOARD.VERSION#", TSBOARD.VERSION)
      text = text.replaceAll("#TSBOARD.SITE.NAME#", TSBOARD.SITE.NAME)
      text = text.replaceAll("#TSBOARD.SITE.TITLE#", TSBOARD.SITE.TITLE)
      text = text.replaceAll("#TSBOARD.API.URI#", TSBOARD.API.URI)

      const posts = await getLatestPost({
        sinceUid: (await getMaxUid()) + 1,
        bunch: SEO.LIMIT.POST,
        option: 0,
        keyword: "",
        accessUserUid: 0,
      })

      let articles = ""
      for (const post of posts) {
        const date = generateDate(post.submitted)
        let boardType = "board"
        if (post.type === BOARD_TYPE.GALLERY) {
          boardType = "gallery"
        } else if (post.type === BOARD_TYPE.BLOG) {
          boardType = "blog"
        } else if (post.type === BOARD_TYPE.SHOP) {
          boardType = "shop"
        }

        let hashtags = "<ul>"
        const tags = await getTags(post.uid)
        for (const tag of tags) {
          hashtags += `<li>${tag.name}</li>`
        }
        hashtags += "</ul>"

        let comments = "<ul>"
        const replies = await getComments({
          postUid: post.uid,
          page: 1,
          bunch: SEO.LIMIT.COMMENT,
          sinceUid: ((await getMaxCommentUid(post.uid)) || 0) + 1,
          accessUserUid: 0,
          pagingDirection: PAGING_DIRECTION.NEXT,
        })

        for (const reply of replies) {
          const d = generateDate(reply.submitted)
          comments += `<li>${reply.content} 
            <div class="additional">
            <span class="date">${d.year}-${d.month}-${d.day} ${d.hour}:${d.minute}:${d.second}</span> / 
            <span class="like">${reply.like} ${reply.like > 1 ? "likes" : "like"}</span> /
            <span class="writer">written by <strong>${reply.writer.name}</strong></span></div>
          </li>`
        }
        comments += "</ul>"

        articles += `<article class="article">
            <div class="image">
              <img src="${TSBOARD.PREFIX}${post.cover.length > 0 ? post.cover : "/image-not-found.svg"}" width="300" />
            </div>
            <div class="post">
              <h2 class="title"><a href="${TSBOARD.API.URI}/${boardType}/${post.id}/${post.uid}" target="_blank" title="사용자를 위한 페이지에서 이 게시글을 열어봅니다">${post.title}</a></h2>
              <div class="content">
                <div class="additional">
                  <span class="date">${date.year}-${date.month}-${date.day} ${date.hour}:${date.minute}:${date.second}</span> / <span class="like">${post.like} ${post.like > 1 ? "likes" : "like"}</span> /
                  <span class="reply">${post.comment} ${post.comment > 1 ? "replies" : "reply"}</span>,
                  <span class="writer">written by <strong>${post.writer.name}</strong></span>
                </div>
                <div class="text">${post.content}</div>
              </div>
            </div>`
        if (hashtags !== "<ul></ul>") {
          articles += `<section class="tag">${hashtags}</section>`
        }
        if (comments !== "<ul></ul>") {
          articles += `<section class="comment">${comments}</section>`
        }
        articles += `</article>\n`
      }

      text = text.replace("#ARTICLES#", articles)
      return text
    })
})
