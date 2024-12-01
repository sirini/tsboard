import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { CountPair } from "../../../src/interface/board"
import {
  getSuggestionTags
} from "../../database/board/editor"
import {
  DEFAULT_TYPE_CHECK,
  fail,
  success
} from "../../util/tools"

export const tagSuggestionRouter = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/tag/suggestion",
    async ({ query: { tag, limit } }) => {
      const response = {
        suggestions: [] as CountPair[],
      }
      if (tag.length < 3) {
        return fail(`Tag is too short.`, response)
      }
      const suggestions = await getSuggestionTags(tag, limit)
      return success({
        suggestions,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        tag: t.String(),
        limit: t.Numeric(),
      }),
    },
  )