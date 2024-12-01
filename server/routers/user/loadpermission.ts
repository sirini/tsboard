import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import { NO_TABLE_TARGET, USER_PERMISSION_PARAMS } from "../../database/user/const"
import {
  getUserPermission,
  haveAdminPermission
} from "../../database/user/manageuser"
import { DEFAULT_TYPE_CHECK, fail, success } from "../../util/tools"

export const loadPermissionRouter = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers: { authorization }, cookie: { refresh }, query: { userUid } }) => {
    let accessUserUid = 0
    let newAccessToken = ""

    const verification = await checkUserVerification({
      jwt,
      userUid: parseInt(userUid ?? "0"),
      accessToken: authorization ?? "",
      refreshToken: refresh.value ?? "",
    })

    if (verification.success === true) {
      accessUserUid = verification.accessUserUid
      newAccessToken = verification.newAccessToken
    }

    if ((await haveAdminPermission(accessUserUid, NO_TABLE_TARGET)) === false) {
      return {
        accessUserUid,
        newAccessToken,
      }
    }

    return {
      accessUserUid,
      newAccessToken,
    }
  })
  .get(
    "/load/permission",
    async ({ newAccessToken, query: { targetUserUid } }) => {
      let response = {
        newAccessToken: "",
        permission: USER_PERMISSION_PARAMS,
      }
      if (targetUserUid < 1) {
        return fail(`Invalid target user uid.`, response)
      }
      const permission = await getUserPermission(targetUserUid)
      return success({
        newAccessToken,
        permission,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        targetUserUid: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )