import registerUser from './registerUser.js'
import loginUser from './loginUser.js'
import { changePassword } from './changePassword.js'
import { deleteUserAccount } from './deleteUser.js'

import { getUserProfile, updateUserProfile, getOwnProfile } from './profileUser.js'

import { addToGameList, removeFromGameList, getGameList, getOwnGameList } from './gameListsUser.js'

export {
    registerUser,
    loginUser,
    changePassword,
    deleteUserAccount
}

export {
    getUserProfile,
    updateUserProfile,
    getOwnProfile
}

export {
    addToGameList,
    removeFromGameList,
    getGameList,
    getOwnGameList
}