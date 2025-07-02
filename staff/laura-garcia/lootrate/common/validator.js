import { FormatError } from './errors.js'

const email = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        throw new FormatError('formato de email inválido')
    }
}

const password = (password) => {
    if (typeof password !== 'string' || password.length < 6) {
        throw new FormatError('la contraseña debe tener al menos 6 caracteres')
    }
}

const username = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
    if (!usernameRegex.test(username)) {
        throw new FormatError('el nombre de usuario debe tener entre 3-20 caracteres y contener solo letras, números, guiones y guiones bajos')
    }
}

const passwordSecurity = (password) => {
    const errors = []
    
    if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres')
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push('La contraseña debe contener al menos una letra mayúscula')
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push('La contraseña debe contener al menos una letra minúscula')
    }
    
    if (!/[0-9]/.test(password)) {
        errors.push('La contraseña debe contener al menos un número')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('La contraseña debe contener al menos un carácter especial')
    }
    
    return errors
}

const validateId = (id, name = 'id') => {
    if (!id || typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new FormatError(`formato de ${name} inválido`)
    }
}

const validateText = (text, name = 'texto', minLength = 1, maxLength = 1000) => {
    if (!text || typeof text !== 'string') {
        throw new FormatError(`${name} es requerido y debe ser una cadena de texto`)
    }
    if (text.trim().length < minLength) {
        throw new FormatError(`${name} debe tener al menos ${minLength} caracteres`)
    }
    if (text.length > maxLength) {
        throw new FormatError(`${name} no debe exceder ${maxLength} caracteres`)
    }
}

const validateNumber = (number, name = 'número', min = 0, max = 100) => {
    if (typeof number !== 'number' || isNaN(number)) {
        throw new FormatError(`${name} debe ser un número válido`)
    }
    if (number < min || number > max) {
        throw new FormatError(`${name} debe estar entre ${min} y ${max}`)
    }
}

const validateRawgId = (gameId, name = 'gameId') => {
    const numericId = Number(gameId)
    if (!gameId || isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
        throw new FormatError(`formato de ${name} inválido - debe ser un número entero positivo`)
    }
}

const validateGameId = (gameId, name = 'gameId') => {
    const numericId = Number(gameId)
    if (!gameId || isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
        throw new FormatError(`formato de ${name} inválido - debe ser un número entero positivo`)
    }
}

export {
    email,         
    password,         
    username,         
    passwordSecurity,   
    validateId,         
    validateRawgId,     
    validateGameId,    
    validateText,       
    validateNumber      
}