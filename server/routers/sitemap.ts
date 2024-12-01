/**
 * server/routers/sitemap
 *
 * SEO 최적화를 위한 사이트맵 및 크롤러를 위한 서버 생성 페이지들
 */

import { Elysia } from "elysia"
import { TEXT } from "../../src/messages/pages/home/about"
import { POLICY, SEO, TSBOARD } from "../../tsboard.config"
import { getComments, getMaxCommentUid } from "../database/board/comment"
import { BOARD_TYPE, PAGING_DIRECTION } from "../database/board/const"
import { getTags } from "../database/board/view"
import { select, table } from "../database/common"
import { getLatestPost, getMaxUid } from "../database/home/list"
import { generateDate } from "../util/tools"

export const sitemapRouter = new Elysia().group("/seo", (app) => {
  return app
    .get("/sitemap.xml", async ({ set }) => {
      set.headers["Content-Type"] = "application/xml"

      const date = generateDate()
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>${TSBOARD.API.URI}/tsapi/seo/main.html</loc><changefreq>daily</changefreq><priority>1.0</priority><lastmod>${date.year}-${date.month}-${date.day}</lastmod></url>
      <url><loc>${TSBOARD.API.URI}/tsapi/seo/about.html</loc><changefreq>monthly</changefreq><priority>0.3</priority><lastmod>${date.year}-${date.month}-${date.day}</lastmod></url>
      <url><loc>${TSBOARD.API.URI}/tsapi/seo/policy.html</loc><changefreq>monthly</changefreq><priority>0.3</priority><lastmod>${date.year}-${date.month}-${date.day}</lastmod></url>`

      const boards = await select(`SELECT id FROM ${table}board`)
      for (const board of boards) {
        xml += `<url><loc>${TSBOARD.API.URI}/board/${board.id}</loc><changefreq>daily</changefreq><priority>1.0</priority><lastmod>${date.year}-${date.month}-${date.day}</lastmod></url>`
      }
      xml += "</urlset>"

      return xml
    })
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
    .get("/about.html", async ({ set }) => {
      set.headers["Content-Type"] = "text/html"
      const file = Bun.file("./public/seo/template/about.html")
      let text = await file.text()
      text = text.replaceAll("#TSBOARD.VERSION#", TSBOARD.VERSION)
      text = text.replaceAll("#TSBOARD.SITE.NAME#", TSBOARD.SITE.NAME)
      text = text.replaceAll("#TSBOARD.SITE.TITLE#", TSBOARD.SITE.TITLE)
      text = text.replaceAll("#TSBOARD.API.URI#", TSBOARD.API.URI)
      text = text.replace("#TITLE#", TEXT[0].TITLE)
      text = text.replace("#INFO#", TEXT[0].INFO)
      return text
    })
    .get("/policy.html", async ({ set }) => {
      set.headers["Content-Type"] = "text/html"
      const file = Bun.file("./public/seo/template/policy.html")
      let text = await file.text()
      text = text.replaceAll("#TSBOARD.VERSION#", TSBOARD.VERSION)
      text = text.replaceAll("#TSBOARD.SITE.NAME#", TSBOARD.SITE.NAME)
      text = text.replaceAll("#TSBOARD.SITE.TITLE#", TSBOARD.SITE.TITLE)
      text = text.replaceAll("#TSBOARD.API.URI#", TSBOARD.API.URI)
      text = text.replace(
        "#POLICY#",
        `<p>본 개인정보 처리방침은 [<strong>${TSBOARD.SITE.NAME}</strong>] 가(이) 운영하는 「<strong>${TSBOARD.API.URI}</strong>」 (이하 "서비스")에서 제공하는 모든 서비스에 적용되며, 회사가 사용자의 개인정보를 어떻게 수집, 사용, 공유 및 보호하는지, 그리고 사용자의 권리와 선택에 대해 설명합니다.</p><p>&nbsp;</p>
        <h2>1. 수집하는 개인정보 항목 및 수집 방법</h2><p>${TSBOARD.SITE.NAME}는 서비스 제공을 위해 다음과 같은 개인정보를 수집하고 있습니다.</p><p>&nbsp;</p><blockquote><p>수집 항목: 이름, 이메일 주소, 서비스 사용 데이터, 접속 로그, 쿠키, 접속 IP 정보</p><p>수집 방법: 웹사이트 회원가입, 서비스 이용 과정, 생성 정보 수집 툴을 통한 수집</p></blockquote><p>&nbsp;</p>
        <h2>2. 개인정보의 수집 및 이용 목적</h2><p>${TSBOARD.SITE.NAME}는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p><p>&nbsp;</p><ol><li>서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산</li><li>회원 관리, 개인 식별, 서비스 이용에 따른 법적 문제 대응</li><li>신규 서비스 개발, 마케팅 및 광고에의 활용</li></ol><p>&nbsp;</p>
        <h2>3. 개인정보의 보유 및 이용 기간</h2><p>${TSBOARD.SITE.NAME}는 법령에 따른 개인정보 보유·이용 기간 또는 이용자로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용 기간 내에서 개인정보를 처리합니다. 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p><p>&nbsp;</p><p>회원가입 및 관리: 서비스 이용 계약 해지 시까지</p><p>전자상거래 거래 기록: 5년</p><p>&nbsp;</p>
        <h2>4. 개인정보의 파기 절차 및 방법</h2><p>${TSBOARD.SITE.NAME}는 원칙적으로 개인정보 보유기간의 경과, 처리목적 달성 등 해당 정보의 필요성이 사라진 경우에는 지체 없이 해당 개인정보를 파기합니다.</p><p>&nbsp;</p><p>파기절차: 이용자가 서비스 이용을 위해 입력한 정보는 목적이 달성된 후 내부 방침 및 기타 관련 법령에 따라 일정 기간 저장된 후 파기됩니다.</p><p>파기방법: 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이 문서에 기록된 개인정보는 분쇄기로 분쇄하거나 소각합니다.</p><p>&nbsp;</p>
        <h2>5. 이용자의 권리와 그 행사 방법</h2><p>개인정보 열람 요구</p><p>오류 등이 있을 경우 정정 요구</p><p>삭제 요구</p><p>처리정지 요구</p><p>이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 가입해지를 요청할 수도 있습니다.</p><p>&nbsp;</p>
        <h2>6. 개인정보 보호를 위한 기술적/관리적 대책</h2><p>${TSBOARD.SITE.NAME}는 개인정보 보호를 위해 다음과 같은 기술적/관리적 대책을 강구하고 있습니다.</p><p>&nbsp;</p><ol><li>개인정보 암호화</li><li>접근 권한의 제한 및 교육</li><li>개인정보에 대한 접근 기록의 보관 및 위변조 방지</li><li>개인정보를 안전하게 처리할 수 있는 내부 절차 마련</li></ol><p>&nbsp;</p>
        <h2>7. 개인정보 보호책임자</h2><p>${TSBOARD.SITE.NAME}는 개인정보 처리와 관련하여 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p><p>&nbsp;</p><blockquote><p>이름: <strong>${POLICY.NAME}</strong></p><p>연락처: <strong>${POLICY.EMAIL}</strong></p></blockquote><p>&nbsp;</p>
        <h2>8. 변경 사항에 대한 공지</h2><p>본 개인정보 처리방침은 법령, 정책 및 ${TSBOARD.SITE.NAME} 내부 운영 방침 또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 시에는 변경사항의 시행 일자 최소 7일 전부터 웹사이트의 공지사항을 통하여 고지할 것입니다.</p>`,
      )
      return text
    })
})
