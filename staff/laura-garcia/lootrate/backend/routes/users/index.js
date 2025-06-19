// Importar dependencias necesarias
import { Router, json } from 'express'
import handlers from "./handlers/index.js"
import extractId from "../../middlewares/extractId.js"

// Middleware para parsear JSON
const jsonBodyParser = json()
// Router para las rutas de usuarios
const userRouter = Router()

// Rutas de autenticación
userRouter.post('/', jsonBodyParser, handlers.registerUser)  // Registrar usuario
userRouter.post('/auth', jsonBodyParser, handlers.loginUser)  // Iniciar sesión

// Rutas de perfil
userRouter.get('/profile/own', extractId, handlers.getProfile)  // Obtener perfil propio
userRouter.get('/profile/user/:username', handlers.getProfile)  // Obtener perfil por username
userRouter.put('/profile', jsonBodyParser, extractId, handlers.updateProfile)  // Actualizar perfil

// Ruta para cambiar contraseña (nueva ruta)
userRouter.put('/change-password', jsonBodyParser, extractId, handlers.changePassword)

// Ruta para eliminar cuenta
userRouter.delete('/account', jsonBodyParser, extractId, handlers.deleteUser)  // Eliminar cuenta

// Rutas de listas de juegos (actualizadas para coincidir con el frontend)
userRouter.post('/lists/add', jsonBodyParser, extractId, handlers.addToListHandler)  // Agregar a lista
userRouter.delete('/lists/remove', jsonBodyParser, extractId, handlers.removeFromListHandler)  // Quitar de lista
userRouter.get('/lists/own/:listType', extractId, handlers.getGameListHandler)  // Obtener lista propia
userRouter.get('/lists/user/:username/:listType', handlers.getGameListHandler)  // Obtener lista de otro usuario

export default userRouter