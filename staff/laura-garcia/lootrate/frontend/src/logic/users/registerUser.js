import { validator, errors } from 'common'

const registerUser = async (registerData) => {
    try {
        const securityErrors = validator.passwordSecurity(registerData['password'])

        if (securityErrors.length > 0) {
            throw new errors.FormatError(securityErrors.join(', '))
        }

        if (registerData['password'] !== registerData['confirmation-password']) {
            throw new errors.ContentError('La contraseña y la confirmación de contraseña no coinciden')
        }

        validator.email(registerData['email'])
        validator.password(registerData['password'])
        validator.password(registerData['confirmation-password'])

        const user = { 
            email: registerData['email'], 
            password: registerData['password'],
            username: registerData['username']
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        if (response.status === 201) {
            return { success: true }
        } else {
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        if (error instanceof errors.FormatError || 
            error instanceof errors.ContentError || 
            error instanceof errors.DuplicityError) {
            throw error
        }
        throw new errors.ConnectionError(error.message)
    }
}

export default registerUser