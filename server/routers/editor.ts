import { Elysia } from "elysia"
import { configRouter } from "./editor/config"
import { loadImagesRouter } from "./editor/loadimages"
import { loadPostRouter } from "./editor/loadpost"
import { modifyRouter } from "./editor/modify"
import { removeAttachedRouter } from "./editor/removeattached"
import { removeImageRouter } from "./editor/removeimage"
import { tagSuggestionRouter } from "./editor/tagsuggestion"
import { uploadImagesRouter } from "./editor/uploadimages"
import { writeRouter } from "./editor/write"

export const editorRouter = new Elysia().group("/editor", (app) => {
  return app.use(loadPostRouter)
    .use(removeAttachedRouter)
    .use(modifyRouter)
    .use(writeRouter)
    .use(configRouter)
    .use(uploadImagesRouter)
    .use(loadImagesRouter)
    .use(removeImageRouter)
    .use(tagSuggestionRouter)
})
