import { errors, validator } from "common"

const loginUser = (loginData) => { //{'email': 'patata@mail.com'}
    validator.password(loginData['password'])
    validator.email(loginData['email'])

    const user = { email: loginData.email, password: loginData.password }

    return fetch(`${import.meta.env.VITE_API_APP}/users/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .catch(error => { throw new errors.ConnectionError(error.message) })
        .then((response) => {
            if (response.status === 200) {
                if (loginData['remember']) {
                    return response.json().then(body => {
                        localStorage.token = body.token
                    })
                } else {
                    return response.json().then(body => {
                        sessionStorage.token = body.token
                    })
                }
            } else {
                return response.json().then(body => {
                    throw new errors[body.name](body.message)
                })
            }
        })
}

export default loginUser