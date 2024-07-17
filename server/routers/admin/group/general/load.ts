/**
 * server/routers/admin/group/general/load
 *
 * 특정 그룹에 대한 관리화면 불러오기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, DEFAULT_TYPE_CHECK } from "../../../../util/tools"
import {
  getGroupBoards,
  getGroupConfig,
  getGroupAdminCandidates,
  getExistBoardIds,
} from "../../../../database/admin/group/general/load"
import { INIT_GROUP_CONFIG } from "../../../../database/admin/group/general/const"
import { checkUserVerification } from "../../../../database/auth/authorization"
import { haveAdminPermission } from "../../../../database/user/manageuser"
import { NO_TABLE_TARGET } from "../../../../database/user/const"

export const load = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/load",
    async ({ jwt, cookie: { refresh }, headers: { authorization }, query: { id, userUid } }) => {
      const response = {
        newAccessToken: "",
        config: INIT_GROUP_CONFIG,
        boards: [],
      }

      const verification = await checkUserVerification({
        jwt,
        userUid,
        accessToken: authorization,
        refreshToken: refresh.value ?? "",
      })

      if (verification.success === false) {
        return fail(`Unauthorized access.`, response)
      }

      if ((await haveAdminPermission(verification.accessUserUid, NO_TABLE_TARGET)) === false) {
        return fail(`Access denied, only administrator can access.`, response)
      }

      const config = await getGroupConfig(id)
      if (config.uid < 1) {
        return fail(`Invalid group ID.`, response)
      }
      const boards = await getGroupBoards(config.uid)

      return success({
        newAccessToken: verification.newAccessToken,
        config,
        boards,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        id: t.String(),
        userUid: t.Numeric(),
      }),
    },
  )
  .get(
    "/candidates",
    async ({ query: { name, limit } }) => {
      const response = {
        candidates: [],
      }

      if (name.length < 2) {
        return fail(`name is too short.`, response)
      }
      if (limit < 1) {
        return fail(`Invalid a limit.`, response)
      }
      const candidates = await getGroupAdminCandidates(name, limit)
      return success({
        candidates,
      })
    },
    {
      query: t.Object({
        name: t.String(),
        limit: t.Numeric(),
      }),
    },
  )
  .get(
    "/boardids",
    async ({ query: { id, limit } }) => {
      const response = {
        ids: [],
      }

      if (id.length < 2) {
        return fail(`ID is too short.`, response)
      }
      const ids = await getExistBoardIds(id, limit)
      return success({
        ids,
      })
    },
    {
      query: t.Object({
        id: t.String(),
        limit: t.Numeric(),
      }),
    },
  )
