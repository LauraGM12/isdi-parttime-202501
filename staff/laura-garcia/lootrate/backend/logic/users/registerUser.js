import { errors } from "common"
import { data } from "../../data/index.js"
import bcrypt from "bcrypt"

// Función para registrar un nuevo usuario en la base de datos
const registerUser = (email, password, username) => {
    // Buscamos si ya existe un usuario con el mismo email
    return data.users.findOne({ email: email })
        // Si hay error en la consulta, lanzamos ServerError
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((user) => {
            // Si el usuario ya existe, lanzamos error de duplicidad
            if (user) { throw new errors.DuplicityError('el usuario ya existe') }

            // Encriptamos la contraseña con bcrypt (factor de costo 5)
            return bcrypt.hash(password, 5)
                // Si hay error en el hash, lanzamos ServerError
                .catch(error => { throw new errors.ServerError(error.message) })
                .then(hashPassword => {
                    // Creamos un nuevo objeto usuario con los datos proporcionados
                    const newUser = new data.users({
                        email,           // Email del usuario
                        password: hashPassword,  // Contraseña encriptada
                        username         // Nombre de usuario
                    })

                    // Guardamos el nuevo usuario en la base de datos
                    return newUser.save()
                        // Si hay error al guardar, lanzamos ServerError
                        .catch(error => { throw new errors.ServerError(error.message) })
                })
        })
}

// Exportamos la función para uso en otros módulos
export default registerUser