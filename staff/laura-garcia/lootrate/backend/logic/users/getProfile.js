import { errors } from "common"
import { data } from "../../data/index.js"

// Función para obtener el perfil de un usuario
const getProfile = (userId) => {
    return data.users.findById(userId)
        .select('-password') // Excluir la contraseña del resultado
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('usuario no encontrado') }
            return user
        })
}

export default getProfile