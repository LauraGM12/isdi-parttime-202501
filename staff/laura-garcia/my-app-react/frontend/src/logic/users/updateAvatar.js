import data from "../../data"
import { ExistenceError } from "../../utils/errors"
import validator from "../../utils/validators"
import getLoggedUserId from "../helpers/getLoggedUserId"

const updateAvatar = (newAvatar) => {
    //validator.imgUrl(newAvatar)

    const loggedUserId = getLoggedUserId()

    validator.id(loggedUserId)

    const user = data.users.findUserById(loggedUserId)

    if (!user) throw new ExistenceError('Usuario no encontrado')
    user.avatar = newAvatar
    data.users.updateUserById(loggedUserId, user)
}

export default updateAvatar