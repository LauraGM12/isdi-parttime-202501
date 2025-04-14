import data from "../../data"
import { ExistenceError } from "../../utils/errors"
import validator from "../../utils/validators"
import getLoggedUserId from "../helpers/getLoggedUserId"

const updateEmail = (newEmail) => {
    validator.email(newEmail)
    const loggedUserId = getLoggedUserId()

    const doesUserExist = data.users.findUserByEmail(newEmail)
    if (doesUserExist) {
        throw new ExistenceError('Algo salió mal, intenta de nuevo con credenciales diferentes')
    }

    const user = data.users.findUserById(loggedUserId)

    if (!user) throw new ExistenceError('Usuario no encontrado')
    user.email = newEmail
    data.users.updateUserById(loggedUserId, user)
}

export default updateEmail