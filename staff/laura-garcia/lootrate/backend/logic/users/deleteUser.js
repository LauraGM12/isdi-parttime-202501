import { data } from '../../data/index.js'
import bcrypt from 'bcrypt' 
import { errors } from 'common'

const { users, reviews } = data
const { NotFoundError, CredentialsError } = errors

const deleteUser = async (userId, email, password) => {
    // Buscar el usuario
    const user = await users.findById(userId)
    if (!user) {
        throw new NotFoundError('Usuario no encontrado')
    }
    
    // Verificar que el email coincida
    if (user.email !== email) {
        throw new CredentialsError('El email no coincide')
    }
    
    // Verificar la contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
        throw new CredentialsError('Contraseña incorrecta')
    }
    
    // Eliminar todas las reseñas del usuario
    await reviews.deleteMany({ userId: userId })
    
    // Eliminar el usuario
    await users.findByIdAndDelete(userId)
    
    return { message: 'Cuenta eliminada exitosamente' }
}

export default deleteUser