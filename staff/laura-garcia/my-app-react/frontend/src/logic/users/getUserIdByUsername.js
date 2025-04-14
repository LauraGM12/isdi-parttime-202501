import data from "../../data";
import { ExistenceError } from "../../utils/errors";
import validator from "../../utils/validators";

const getUserIdByUsername = (username) => {
    validator.username(username)

    const user = data.users.findUserByUsername(username)

    if (!user) throw new ExistenceError('Usuario no encontrado')
    return user.id
}

export default getUserIdByUsername