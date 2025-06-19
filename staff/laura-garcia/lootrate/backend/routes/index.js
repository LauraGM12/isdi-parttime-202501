import { Router, json } from "express"
import handlers from "./handlers/index.js"
import extractId from "../../middlewares/extractId.js"

const jsonBodyParser = json()
const userRouter = Router()

// Rutas de autenticación
userRouter.post('/', jsonBodyParser, handlers.registerUser)
userRouter.post('/auth', jsonBodyParser, handlers.loginUser)

// Rutas de perfil
userRouter.get('/profile/own', extractId, handlers.getProfile)
userRouter.get('/profile/user/:username', handlers.getProfile)
userRouter.put('/profile', jsonBodyParser, extractId, handlers.updateProfile)

// Ruta para eliminar cuenta
userRouter.delete('/account', jsonBodyParser, extractId, handlers.deleteUser)

// Rutas de listas de juegos
userRouter.post('/lists/add', jsonBodyParser, extractId, handlers.addToListHandler)
userRouter.delete('/lists/remove', jsonBodyParser, extractId, handlers.removeFromListHandler)
userRouter.get('/lists/own/:listType', extractId, handlers.getGameListHandler)
userRouter.get('/lists/user/:username/:listType', handlers.getGameListHandler)

export default userRouter