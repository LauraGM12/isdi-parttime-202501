import data from "../../data"
import { ExistenceError } from "../../utils/errors";
import validator from "../../utils/validators";
import getLoggedUserId from "../helpers/getLoggedUserId";

const updateUsername = (newUsername) => {
    validator.username(newUsername)

    const loggedUserId = getLoggedUserId()

    validator.id(loggedUserId)

    const user = data.users.findUserById(loggedUserId)
    if (!user) throw new ExistenceError('user not found')
    user.username = newUsername
    data.users.updateUserById(loggedUserId, user)
}

export default updateUsername