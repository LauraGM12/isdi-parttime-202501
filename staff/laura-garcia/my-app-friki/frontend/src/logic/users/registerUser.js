import { errors, validator } from "common"

const registerUser = (registerData) => { //registerData = {'email': '', 'password': '', 'confirmation-password': ''}
    const securityErrors = validator.passwordSecurity(registerData['password'])

    if (securityErrors.length > 0) throw new errors.FormatError(securityErrors.join(','))

    if (registerData['password'] !== registerData['confirmation-password']) {
        throw new errors.ContentError('password and confirmation password are not the same')
    }

    validator.email(registerData['email'])
    validator.password(registerData['password'])
    validator.password(registerData['confirmation-password'])

    const user = { email: registerData['email'], password: registerData['password'] }

    return fetch(`${import.meta.env.VITE_API_APP}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .catch(error => { throw new errors.ConnectionError(error.message) })
        .then(response => {
            if (response.status === 201) return
            else {
                return response.json().then(body => {
                    throw new errors[body.name](body.message)
                })
            }
        })


}

export default registerUser