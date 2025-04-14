import data from "../../data"
import { AuthError, ContentError, ExistenceError } from "../../utils/errors"
import validator from "../../utils/validators"
import getLoggedUserId from "../helpers/getLoggedUserId"

const updatePassword = (newPassword, confirmationNewPassword, oldPassword) => {
    validator.password(newPassword)
    validator.password(confirmationNewPassword)
    validator.password(oldPassword)

    if (newPassword !== confirmationNewPassword) {
        throw new ContentError('Las contraseñas no coinciden')
    }

    const loggedUserId = getLoggedUserId()

    const user = data.users.findUserById(loggedUserId)

    if (!user) throw new ExistenceError('Usuario no encontrado')
    if (user.password !== oldPassword) throw new AuthError('Contraseña incorrecta')
    user.password = newPassword
    data.users.updateUserById(loggedUserId, user)
}

export default updatePassword