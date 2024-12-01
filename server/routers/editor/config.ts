import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { Pair } from "../../../src/interface/board"
import { BOARD_CONFIG } from "../../database/board/const"
import {
  getCategories
} from "../../database/board/editor"
import { getBoardConfig } from "../../database/board/list"
import { haveAdminPermission } from "../../database/user/manageuser"
import {
  fail,
  success
} from "../../util/tools"

export const configRouter = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/config",
    async ({ query: { id, userUid } }) => {
      const response = {
        newAccessToken: "",
        config: BOARD_CONFIG,
        categories: [] as Pair[],
        isAdmin: false,
      }
      if (id.length < 2) {
        return fail(`Invalid board ID.`, response)
      }
      const config = await getBoardConfig(id)
      const categories = await getCategories(config.uid)
      const isAdmin = await haveAdminPermission(userUid, config.uid)
      return success({
        newAccessToken: "",
        config,
        categories,
        isAdmin,
      })
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        id: t.String(),
        userUid: t.Numeric(),
      }),
    },
  )