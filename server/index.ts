/**
 * Deprecated warning
 * ------------------
 * TSBOARD v1.0.0 이후부터 Go언어로 작성된 새 백엔드가 사용되며, Bun 런타임 기반 백엔드는 더 이상 사용되지 않습니다.
 * `server/` 폴더에 타입스크립트로 작성된 모든 코드들은 더 이상 유지/보수 되지 않습니다. (보관용)
 *
 */

// import { cors } from "@elysiajs/cors"
// import { Elysia } from "elysia"
// import { admin } from "./routers/admin"
// import { auth } from "./routers/auth"
// import { blogRssRouter } from "./routers/blog"
// import { boardRouter } from "./routers/board"
// import { chatRouter } from "./routers/chat"
// import { commentRouter } from "./routers/comment"
// import { editorRouter } from "./routers/editor"
// import { homeRouter } from "./routers/home"
// import { notiRouter } from "./routers/noti"
// import { seoRouter } from "./routers/seo"
// import { syncRouter } from "./routers/sync"
// import { userRouter } from "./routers/user"

// const app = new Elysia()
//   .use(cors())
//   .group("/tsapi", (app) => {
//     return app.use(auth)
//       .use(admin)
//       .use(homeRouter)
//       .use(userRouter)
//       .use(boardRouter)
//       .use(editorRouter)
//       .use(commentRouter)
//       .use(seoRouter)
//       .use(blogRssRouter)
//       .use(syncRouter)
//       .use(chatRouter)
//       .use(notiRouter)
//   })
//   .listen(3100)

// export type App = typeof app

console.log(
  `Deprecated Warning: This backend API server is no longer supported due to new API written in Go.`,
)
