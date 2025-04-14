import data from "../../data"
import { ExistenceError } from "../../utils/errors"
import validator from "../../utils/validators"
import getLoggedUserId from "../helpers/getLoggedUserId"

const updateBio = (newBio) => {
    validator.text(newBio, 200, 0, 'biografía')

    const loggedUserId = getLoggedUserId()

    validator.id(loggedUserId)

    const user = data.users.findUserById(loggedUserId)
    if (!user) throw new ExistenceError('Usuario no encontrado')
    user.bio = newBio
    data.users.updateUserById(loggedUserId, user)
}

export default updateBio