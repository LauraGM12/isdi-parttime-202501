/*import data from "../../data"
import getToken from "../helpers/getToken"*/

const getRandomBio = () => {

    return fetch(`${import.meta.env.VITE_JOKE_API_URL}`, {
        method: 'GET'
    })
        .catch(error => { throw new errors.ConnectionError(error.message) })
        .then((response) => {
            let randomBio = ''
            if (response.status !== 200) {
                return response.json().then(body => {
                    throw new errors[body.name](body.message)
                })
            } else {
                return response.json()
                    .then(body => {
                        if (body.type === 'single') {
                            randomBio = body.joke
                        }
                        if (body.type === 'twopart') {
                            randomBio = `+ ${body.setup} \n- ${body.delivery}`
                        }

                        return randomBio
                    })
            }
        })
}

export default getRandomBio