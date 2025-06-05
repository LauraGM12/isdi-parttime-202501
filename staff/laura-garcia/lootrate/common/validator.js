import { FormatError } from './errors.js'

// Validador de email usando expresión regular
const email = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        throw new FormatError('invalid email format')
    }
}

// Validador de contraseña (mínimo 6 caracteres)
const password = (password) => {
    if (typeof password !== 'string' || password.length < 6) {
        throw new FormatError('password must be at least 6 characters long')
    }
}

// Validador de username (3-20 caracteres, solo letras, números y guiones)
const username = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
    if (!usernameRegex.test(username)) {
        throw new FormatError('username must be 3-20 characters long and contain only letters, numbers, hyphens and underscores')
    }
}

export {
    email,
    password,
    username
}