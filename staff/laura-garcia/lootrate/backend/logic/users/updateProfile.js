import { errors } from "common"
import { data } from "../../data/index.js"

const updateProfile = (userId, updateData) => {
    const allowedFields = [
        'username', 'email', 'avatar', 'bio', 'firstName', 'lastName', 
        'favoriteGenres', 'favoritePlatforms'
    ]
    
    const filteredData = {}
    Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
            filteredData[key] = updateData[key]
        }
    })

    if (Object.keys(filteredData).length === 0) {
        throw new errors.ValidationError('no hay campos válidos para actualizar')
    }

    return data.users.findByIdAndUpdate(
        userId, 
        filteredData, 
        { new: true, runValidators: true }
    )
    .select('-password')
    .catch(error => {
        if (error.code === 11000) {
            throw new errors.DuplicityError('el nombre de usuario o email ya existe')
        }
        throw new errors.ServerError(error.message)
    })
    .then((user) => {
        if (!user) { throw new errors.ExistenceError('usuario no encontrado') }
        return user
    })
}

export default updateProfile