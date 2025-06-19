// Importamos las funciones de autenticación y registro
import registerUser from './registerUser.js'
import loginUser from './loginUser.js'
import { changePassword } from './changePassword.js'
import { deleteUserAccount } from './deleteUser.js'

// Importamos las funciones de gestión de perfiles
import { getUserProfile, updateUserProfile, getOwnProfile } from './profileUser.js'

// Importamos las funciones de gestión de listas de juegos
import { addToGameList, removeFromGameList, getGameList, getOwnGameList } from './gameListsUser.js'

// Exportamos todas las funciones de autenticación y gestión de cuenta
export {
    registerUser,
    loginUser,
    changePassword,
    deleteUserAccount
}

// Exportamos todas las funciones de gestión de perfiles
export {
    getUserProfile,
    updateUserProfile,
    getOwnProfile
}

// Exportamos todas las funciones de gestión de listas de juegos
export {
    addToGameList,
    removeFromGameList,
    getGameList,
    getOwnGameList
}