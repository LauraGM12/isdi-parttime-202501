import { FormatError } from "./errors"

const validator = {
    email: (email) => {
        if (typeof email !== 'string') {
            throw new TypeError('Email is not a string')
        }
        if (email.length === 0) {
            throw new RangeError('Email is empty')
        }
        const emailRegex = /^([\w.*-]+@([\w-]+\.)+[\w-]{2,4})?$/  //formato mail ---@---.--
        if (emailRegex.test(email) === false) {
            throw new FormatError('Email format not valid')
        }
    },
    password: (password) => {
        if (typeof password !== 'string') {
            throw new TypeError('Email is not a string')
        }
        if (password.length === 0) {
            throw new RangeError('Password is empty')
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&!@=*^ñ?¿¡/#ªº¬])[A-Za-z\d$&!@=*^ñ?¿¡/#ªº¬]{8,}$/ //minimo una mayuscula, minuscula, numero, caracter especial y 8 de length
        if (!passwordRegex.test(password)) {
            throw new FormatError('Password format not valid')
        }
    },
    username: (username) => {
        if (typeof username !== 'string') {
            throw new TypeError('Username is not a string')
        }
        if (username.length === 0 || username.length > 20) {
            throw new RangeError('Username number of characters is not valid')
        }
        /*
        let forbiddenWords = ['curva', 'cabrón', 'hdp', 'insecte']
        for (let i = 0; i < forbiddenWords.length; i++) {
            if (username.includes(forbiddenWords[i])) {
                throw new Error('sin insultos!')
            }
        }
        */
    },
    id: (id) => {
        if (typeof id !== 'number') {
            throw new TypeError('ID is not a number')
        }
    },
    text: (text, maxLength, minLength, explain) => {
        if (typeof text !== 'string') {
            throw new TypeError(`${explain} is not a string`)
        }
        if (text.length > maxLength || text.length < minLength) {
            throw new RangeError(`${explain} number of characters is not valid`)
        }
    },
    imgUrl: (imgUrl) => {
        if (typeof imgUrl !== 'string') {
            throw new TypeError('Image URL is not a string')
        }
        const imgRegex = /^(https?:\/\/).*\.(png|jpg|jpeg)$/
        if (!imgRegex.test(imgUrl)) {
            throw new FormatError('Image URL format is not valid')
        }

    }
}

export default validator