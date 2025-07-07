import { data } from '../../data/index.js'
import bcrypt from 'bcryptjs' 
import { errors } from 'common'


const { users, reviews } = data
const { NotFoundError, CredentialsError } = errors

const deleteUser = async (userId, email, password) => {
    const user = await users.findById(userId)
    if (!user) {
        throw new NotFoundError('Usuario no encontrado')
    }
    
    if (user.email !== email) {
        throw new CredentialsError('El email no coincide')
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
        throw new CredentialsError('Contraseña incorrecta')
    }
    
    await reviews.deleteMany({ author: userId })
    
    await users.findByIdAndDelete(userId)
    
    return { message: 'Cuenta eliminada exitosamente' }
}

export default deleteUser