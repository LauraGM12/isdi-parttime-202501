// Importar todas las funciones de lógica de usuarios
import registerUser from './registerUser.js'
import loginUser from './loginUser.js'
import getProfile from './getProfile.js'
import updateProfile from './updateProfile.js'
import changePassword from './changePassword.js' 
import deleteUser from './deleteUser.js'
import { addToGameList, removeFromGameList, getGameList } from './manageGameLists.js'

// Exportar todas las funciones para que estén disponibles
export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword,
    deleteUser,
    addToGameList,
    removeFromGameList,
    getGameList
}