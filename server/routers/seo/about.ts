import { Elysia } from "elysia"
import { TEXT } from "../../../src/messages/pages/home/about"
import { TSBOARD } from "../../../tsboard.config"

export const aboutRouter = new Elysia()
  .get(
    "/about.html",
    async ({ set }) => {
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
    }
  )

