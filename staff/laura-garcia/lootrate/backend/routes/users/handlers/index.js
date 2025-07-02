import registerUser from './registerUser.js'
import loginUser from './loginUser.js'
import getProfile from './getProfile.js'
import updateProfile from './updateProfile.js'
import deleteUser from './deleteUser.js'
import changePassword from './changePassword.js' 
import { addToListHandler, removeFromListHandler, getGameListHandler } from './manageGameLists.js'

const handlers = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    deleteUser,
    changePassword,  
    addToListHandler,
    removeFromListHandler,
    getGameListHandler
}

export default handlers