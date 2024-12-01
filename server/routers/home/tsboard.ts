import { Elysia, t } from "elysia"
import { addAccessLog } from "../../database/home/visit"

export const tsboardTestRouter = new Elysia()
  .get(
    "/visit",
    async ({ query: { userUid } }) => {
      addAccessLog(userUid)
      return {}
    },
    {
      query: t.Object({
        userUid: t.Numeric(),
      }),
    },
  )
  .get("/tsboard", async () => {
    return {
      success: true,
      officialWebsite: `tsboard.dev`,
      version: process.env.VERSION ?? "",
      license: "MIT",
      Github: "github.com/sirini/tsboard"
    }
  })
