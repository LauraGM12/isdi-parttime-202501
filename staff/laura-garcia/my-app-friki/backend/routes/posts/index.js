import { json, Router } from "express"
import handlers from "./handlers/index.js"
import extractId from "../../middlewares/extractId.js"

const jsonBodyParser = json()
const postRouter = Router()

postRouter.post('/', jsonBodyParser, extractId, handlers.createPost)

postRouter.get('/', extractId, handlers.getAllPosts)
/*postRouter.get('/home', extractId, handlers.getHomePosts)*/
postRouter.get('/author/:authorId', jsonBodyParser, extractId, handlers.getPostsByAuthor)

postRouter.patch('/like/:postId', extractId, handlers.toggleLike)

postRouter.delete('/:postId', extractId, handlers.deletePost)

export default postRouter