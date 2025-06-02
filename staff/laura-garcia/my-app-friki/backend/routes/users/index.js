import { json, Router } from "express";
import handlers from "./handlers/index.js";
import extractId from "../../middlewares/extractId.js";


const jsonBodyParser = json()
const userRouter = Router()

userRouter.post('/', jsonBodyParser, handlers.registerUser)
userRouter.post('/auth', jsonBodyParser, handlers.loginUser)

userRouter.get('/username/:userId', extractId, handlers.getUsername)
userRouter.get('/avatar/:userId', extractId, handlers.getAvatar)
userRouter.get('/bio/:userId', extractId, handlers.getBio)
userRouter.get('/id/:username', extractId, handlers.getUserId)
userRouter.get('/info/:userId', extractId, handlers.getUserMainInfo)

userRouter.patch('/username', jsonBodyParser, extractId, handlers.updateUsername)
userRouter.patch('/avatar', jsonBodyParser, extractId, handlers.updateAvatar)
userRouter.patch('/bio', jsonBodyParser, extractId, handlers.updateBio)
userRouter.patch('/follow/:userId', extractId, handlers.toggleFollow)
userRouter.patch('/email', jsonBodyParser, extractId, handlers.updateEmail)
userRouter.patch('/password', jsonBodyParser, extractId, handlers.updatePassword)

userRouter.delete('/', jsonBodyParser, extractId, handlers.deleteUser)

export default userRouter