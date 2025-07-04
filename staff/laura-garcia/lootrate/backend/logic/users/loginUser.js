import { errors } from 'common'
import { data } from "../../data/index.js" 
import bcrypt from "bcryptjs" 

const loginUser = (email, password) => {
    const normalizedEmail = email.toLowerCase().trim()
    
    return data.users.findOne({ email: normalizedEmail })
        .catch(error => { 
            throw new errors.ServerError(error.message) 
        })
        .then((user) => {
            console.log('Búsqueda de usuario:', { 
                emailBuscado: normalizedEmail, 
                usuarioEncontrado: !!user 
            })
            
            if (!user) { 
                throw new errors.ExistenceError('Usuario no encontrado') 
            }

            return bcrypt.compare(password, user.password)
                .catch(error => { 
                    throw new errors.ServerError(error.message) 
                })
                .then(result => {
                    if (!result) { 
                        throw new errors.AuthError('Credenciales inválidas') 
                    }
                                        
                    return user._id.toString()
                })
        })
}

export default loginUser