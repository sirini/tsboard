import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { Pair, PostFile } from "../../../src/interface/board"
import { checkUserVerification } from "../../database/auth/authorization"
import { checkPermission } from "../../database/board/common"
import { INIT_POST_VIEW } from "../../database/board/const"
import { getUserLevel } from "../../database/board/list"
import { getFiles, getPost, getTags } from "../../database/board/view"
import {
  DEFAULT_TYPE_CHECK,
  fail,
  success
} from "../../util/tools"


export const loadPostRouter = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers: { authorization }, cookie: { refresh }, query: { userUid } }) => {
    let accessUserUid = 0
    let userLevel = 0
    let newAccessToken = ""

    const verification = await checkUserVerification({
      jwt,
      userUid: parseInt(userUid ?? "0"),
      accessToken: authorization ?? "",
      refreshToken: refresh.value ?? "",
    })

    if (verification.success === true) {
      accessUserUid = verification.accessUserUid
      userLevel = await getUserLevel(accessUserUid)
      newAccessToken = verification.newAccessToken
    }

    return {
      accessUserUid,
      userLevel,
      newAccessToken,
    }
  })
  .get(
    "/load/post",
    async ({ query: { boardUid, postUid }, accessUserUid, newAccessToken }) => {
      let response = {
        post: INIT_POST_VIEW,
        files: [] as PostFile[],
        tags: [] as Pair[],
        newAccessToken,
      }
      if (postUid < 1) {
        return fail(`Invalid parameters.`, response)
      }
      const checked = await checkPermission({
        accessUserUid,
        boardUid,
        postUid,
        action: "write_post",
        target: "post",
      })
      if (checked.result === false) {
        return fail(checked.error, response)
      }

      response.post = await getPost(postUid, accessUserUid)
      response.files = await getFiles(postUid)
      response.tags = await getTags(postUid)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        boardUid: t.Numeric(),
        postUid: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )