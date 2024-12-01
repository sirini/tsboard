import { Elysia, t } from "elysia"
import { USER_OPEN_INFO } from "../../database/user/const"
import { getUserOpenInfo } from "../../database/user/userinfo"
import { fail, success } from "../../util/tools"

export const userInfoRouter = new Elysia().get(
  "/load/user/info",
  async ({ query: { targetUserUid } }) => {
    let response = USER_OPEN_INFO
    if (targetUserUid < 1) {
      return fail(`Invalid user uid.`, response)
    }
    response = await getUserOpenInfo(targetUserUid)
    return success(response)
  },
  {
    query: t.Object({
      targetUserUid: t.Numeric(),
    }),
  },
)
