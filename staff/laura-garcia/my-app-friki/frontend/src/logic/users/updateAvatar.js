import getToken from "../helpers/getToken"

const updateAvatar = (newAvatar) => {
    //validator.imgUrl(newAvatar)

    const avatar = { avatar: newAvatar }

    return fetch(`${import.meta.env.VITE_API_APP}/users/avatar`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${getToken()}`
        },
        body: JSON.stringify(avatar)
    })
        .catch(error => { throw new errors.ConnectionError(error.message) })
        .then((response) => {
            if (response.status === 200) return
            else {
                response.json().then(body => {
                    throw new Error(body.message)
                })
            }
        })

}

export default updateAvatar