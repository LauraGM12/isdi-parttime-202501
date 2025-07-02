import { Router, json } from 'express'
import handlers from "./handlers/index.js"
import extractId from "../../middlewares/extractId.js"

const jsonBodyParser = json()
const userRouter = Router()

userRouter.post('/', jsonBodyParser, handlers.registerUser)  
userRouter.post('/auth', jsonBodyParser, handlers.loginUser) 
userRouter.get('/profile/own', extractId, handlers.getProfile) 
userRouter.get('/profile/user/:username', handlers.getProfile) 
userRouter.put('/profile', jsonBodyParser, extractId, handlers.updateProfile)  
userRouter.put('/change-password', jsonBodyParser, extractId, handlers.changePassword)
userRouter.delete('/account', jsonBodyParser, extractId, handlers.deleteUser)  
userRouter.post('/lists/add', jsonBodyParser, extractId, handlers.addToListHandler)  
userRouter.delete('/lists/remove', jsonBodyParser, extractId, handlers.removeFromListHandler) 
userRouter.get('/lists/own/:listType', extractId, handlers.getGameListHandler)
userRouter.get('/lists/user/:username/:listType', handlers.getGameListHandler)  

export default userRouter