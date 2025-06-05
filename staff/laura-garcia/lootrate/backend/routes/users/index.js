import { Router, json } from "express"
import handlers from "./handlers/index.js"
import extractId from "../../middlewares/extractId.js"

// Middleware para parsear JSON en las peticiones
const jsonBodyParser = json()
// Router para las rutas de usuarios
const userRouter = Router()

// Rutas de autenticación (siguiendo el patrón de tu profesora)
userRouter.post('/', jsonBodyParser, handlers.registerUser) // Registro de usuario
userRouter.post('/auth', jsonBodyParser, handlers.loginUser) // Login de usuario

// Aquí puedes añadir más rutas cuando las necesites
// userRouter.get('/username/:userId', extractId, handlers.getUsername)
// userRouter.patch('/username', jsonBodyParser, extractId, handlers.updateUsername)

export default userRouter