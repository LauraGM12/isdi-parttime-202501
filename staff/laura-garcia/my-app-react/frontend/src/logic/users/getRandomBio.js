/*import data from "../../data"
import getLoggedUserId from "../helpers/getLoggedUserId"*/

const getRandomBio = (callback) => {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', import.meta.env.VITE_JOKE_API_URL, true)

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let randomBio = ''
            if (xhr.status === 200) {
                const res = JSON.parse(xhr.response)
                if (res.type === 'single') {
                    randomBio = res.joke
                }
                if (res.type === 'twopart') {
                    randomBio = `+ ${res.setup} \n- ${res.delivery}`
                }

                callback(null, randomBio)

            } else {
                callback('API Externa no está funcionando')
            }
        }
    }

    xhr.send()
}

export default getRandomBio