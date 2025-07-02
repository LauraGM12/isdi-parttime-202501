import { validator, errors } from 'common'

const loginUser = async (loginData) => {
    validator.email(loginData['email'])
    validator.password(loginData['password'])

    const credentials = {
        email: loginData['email'], 
        password: loginData['password'] 
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })

        if (response.status === 200) {
            const body = await response.json()
            return { token: body.token } 
        } else {
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        if (error instanceof errors.ValidationError || error instanceof errors.AuthError) {
            throw error
        }
        throw new errors.ConnectionError(error.message)
    }
}

export default loginUser