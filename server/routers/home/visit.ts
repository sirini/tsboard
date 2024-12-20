import { Elysia, t } from "elysia"
import { addAccessLog } from "../../database/home/visit"

export const visitRouter = new Elysia()
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