import deleteUserById from "./deleteUserById";
import getUserAvatarById from "./getUserAvatarById";
import getUserBioById from "./getUserBiobyId";
import getUserIdByUsername from "./getUserIdByUsername";
import getUserUsernameById from "./getUserUsernameById";
import isUserLoggedIn from "./isUserLoggedIn";
import loginUser from "./loginUser";
import logoutUser from "./logoutUser";
import registerUser from "./registerUser";
import getRandomBio from "./getRandomBio";
import updateAvatar from "./updateAvatar";
import updateBio from "./updateBio";
import updateEmail from "./updateEmail";
import updatePassword from "./updatePassword";
import updateUsername from "./updateUsername";

const users = {
    getUserUsernameById,
    isUserLoggedIn,
    loginUser,
    logoutUser,
    registerUser,
    updateAvatar,
    updateBio,
    updateUsername,
    getUserAvatarById,
    getUserBioById,
    getUserIdByUsername,
    updatePassword,
    updateEmail,
    deleteUserById,
    getRandomBio
}

export default users