import errors from "./errors.js"

const _validator = {
    email: (email) => {
        if (typeof email !== 'string') {
            throw new TypeError('Email is not a string')
        }
        if (email.length === 0) {
            throw new RangeError('Email is empty')
        }
        const emailRegex = /^([\w.*-]+@([\w-]+\.)+[\w-]{2,4})?$/  //formato mail ---@---.--
        if (emailRegex.test(email) === false) {
            throw new errors.FormatError('Email format not valid')
        }
    }, passwordSecurity: (password) => {
        const securityErrors = []
        const numbers = "0123456789"
        let hasANumber = false
        for (let i = 0; i < numbers.length; i++) {
            if (password.includes(numbers[i])) {
                hasANumber = true
                i = numbers.length
            }
        }
        if (!hasANumber) securityErrors.push('needs a number')

        if (password.toLowerCase() === password) securityErrors.push('needs an upper case letter')

        if (password.toUpperCase() === password) securityErrors.push('needs a lower case letter')

        if (password.length < 8) securityErrors.push('needs at least 8 characters')

        const specialChars = '$&!@=*^ñ?¿¡/#ªº¬'
        let hasSpecial = false

        for (let i = 0; i < specialChars.length; i++) {
            if (password.includes(specialChars[i])) {
                hasSpecial = true
                i = specialChars.length
            }
        }

        if (!hasSpecial) securityErrors.push('needs a special character ($&!@=*^ñ?¿¡/#ªº¬)')

        return securityErrors
    },
    password: (password) => {
        if (typeof password !== 'string') {
            throw new TypeError('Email is not a string')
        }
        if (password.length === 0) {
            throw new RangeError('Password is empty')
        }
        const formatErrors = _validator.passwordSecurity(password)
        if (formatErrors.length > 0) {
            throw new errors.FormatError('Password format not valid')
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
        if (typeof id !== 'string') {
            throw new TypeError('ID is not a string')
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
            throw new errors.FormatError('Image URL format is not valid')
        }

    }
}

export default _validator