/**
 * Todas las funciones de validación lanzan FormatError cuando
 * los datos no cumplen con los criterios establecidos.
 */

import { FormatError } from './errors.js'

/**
 * Validador de email usando expresión regular
 * 
 * Verifica que el email tenga un formato válido básico.
 * No verifica si el email existe realmente, solo el formato.
 * 
 * @param {string} email - Email a validar
 * @throws {FormatError} Si el formato del email es inválido
 * 
 * @example
 * email('usuario@ejemplo.com') // ✓ Válido
 * email('email-invalido')      // ✗ Lanza FormatError
 */
const email = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        throw new FormatError('formato de email inválido')
    }
}

/**
 * Validador de contraseña (mínimo 6 caracteres)
 * 
 * Verifica que la contraseña cumpla con los requisitos mínimos de longitud.
 * Para validaciones de seguridad más estrictas, usar passwordSecurity().
 * 
 * @param {string} password - Contraseña a validar
 * @throws {FormatError} Si la contraseña no cumple los requisitos
 * 
 * @example
 * password('123456')   // ✓ Válido (mínimo)
 * password('12345')    // ✗ Lanza FormatError
 */
const password = (password) => {
    if (typeof password !== 'string' || password.length < 6) {
        throw new FormatError('la contraseña debe tener al menos 6 caracteres')
    }
}

/**
 * Validador de username (3-20 caracteres, solo letras, números y guiones)
 * 
 * Verifica que el nombre de usuario cumpla con las reglas establecidas:
 * - Entre 3 y 20 caracteres
 * - Solo letras, números, guiones (-) y guiones bajos (_)
 * 
 * @param {string} username - Nombre de usuario a validar
 * @throws {FormatError} Si el username no cumple los criterios
 * 
 * @example
 * username('usuario123')     // ✓ Válido
 * username('user_name-2')    // ✓ Válido
 * username('ab')             // ✗ Muy corto
 * username('user@name')      // ✗ Carácter inválido
 */
const username = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
    if (!usernameRegex.test(username)) {
        throw new FormatError('el nombre de usuario debe tener entre 3-20 caracteres y contener solo letras, números, guiones y guiones bajos')
    }
}

/**
 * Validador de seguridad de contraseña
 * 
 * Realiza una validación exhaustiva de la seguridad de la contraseña
 * verificando múltiples criterios de complejidad.
 * 
 * @param {string} password - Contraseña a evaluar
 * @returns {string[]} Array de errores encontrados (vacío si es válida)
 * 
 * @example
 * passwordSecurity('Password123!')  // [] (válida)
 * passwordSecurity('123456')        // ['La contraseña debe tener...', ...]
 */
const passwordSecurity = (password) => {
    const errors = []
    
    // Verificar longitud mínima
    if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres')
    }
    
    // Verificar presencia de letra mayúscula
    if (!/[A-Z]/.test(password)) {
        errors.push('La contraseña debe contener al menos una letra mayúscula')
    }
    
    // Verificar presencia de letra minúscula
    if (!/[a-z]/.test(password)) {
        errors.push('La contraseña debe contener al menos una letra minúscula')
    }
    
    // Verificar presencia de número
    if (!/[0-9]/.test(password)) {
        errors.push('La contraseña debe contener al menos un número')
    }
    
    // Verificar presencia de carácter especial
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('La contraseña debe contener al menos un carácter especial')
    }
    
    return errors
}

/**
 * Validador de ID de MongoDB
 * 
 * Verifica que el ID tenga el formato válido de ObjectId de MongoDB
 * (24 caracteres hexadecimales).
 * 
 * @param {string} id - ID a validar
 * @param {string} name - Nombre del campo para mensajes de error
 * @throws {FormatError} Si el ID no tiene formato válido
 * 
 * @example
 * validateId('507f1f77bcf86cd799439011')  // ✓ Válido
 * validateId('invalid-id')               // ✗ Lanza FormatError
 */
const validateId = (id, name = 'id') => {
    if (!id || typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new FormatError(`formato de ${name} inválido`)
    }
}

/**
 * Validador de texto genérico
 * 
 * Valida que un texto cumpla con los requisitos de longitud
 * y sea una cadena válida.
 * 
 * @param {string} text - Texto a validar
 * @param {string} name - Nombre del campo para mensajes de error
 * @param {number} minLength - Longitud mínima requerida
 * @param {number} maxLength - Longitud máxima permitida
 * @throws {FormatError} Si el texto no cumple los requisitos
 */
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

/**
 * Validador de números
 * 
 * Verifica que un valor sea un número válido dentro del rango especificado.
 * 
 * @param {number} number - Número a validar
 * @param {string} name - Nombre del campo para mensajes de error
 * @param {number} min - Valor mínimo permitido
 * @param {number} max - Valor máximo permitido
 * @throws {FormatError} Si el número no es válido o está fuera del rango
 */
const validateNumber = (number, name = 'número', min = 0, max = 100) => {
    if (typeof number !== 'number' || isNaN(number)) {
        throw new FormatError(`${name} debe ser un número válido`)
    }
    if (number < min || number > max) {
        throw new FormatError(`${name} debe estar entre ${min} y ${max}`)
    }
}

/**
 * Validador de ID de RAWG (números enteros)
 * 
 * Verifica que el ID sea un número entero positivo válido
 * para usar con la API de RAWG.
 * 
 * @param {string|number} gameId - ID del juego a validar
 * @param {string} name - Nombre del campo para mensajes de error
 * @throws {FormatError} Si el ID no es un entero positivo válido
 * 
 * @example
 * validateRawgId('12345')  // ✓ Válido
 * validateRawgId(12345)    // ✓ Válido
 * validateRawgId('abc')    // ✗ Lanza FormatError
 */
const validateRawgId = (gameId, name = 'gameId') => {
    const numericId = Number(gameId)
    if (!gameId || isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
        throw new FormatError(`formato de ${name} inválido - debe ser un número entero positivo`)
    }
}

/**
 * Validador específico para IDs de juegos de RAWG
 * 
 * Alias de validateRawgId específicamente para IDs de juegos.
 * Mantiene la misma funcionalidad pero con un nombre más descriptivo.
 * 
 * @param {string|number} gameId - ID del juego a validar
 * @param {string} name - Nombre del campo para mensajes de error
 * @throws {FormatError} Si el ID no es un entero positivo válido
 */
const validateGameId = (gameId, name = 'gameId') => {
    const numericId = Number(gameId)
    if (!gameId || isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
        throw new FormatError(`formato de ${name} inválido - debe ser un número entero positivo`)
    }
}

// Exportar todas las funciones de validación
export {
    email,              // Validación de formato de email
    password,           // Validación básica de contraseña
    username,           // Validación de nombre de usuario
    passwordSecurity,   // Validación avanzada de seguridad de contraseña
    validateId,         // Validación de ObjectId de MongoDB
    validateRawgId,     // Validación de ID de RAWG
    validateGameId,     // Validación específica de ID de juego
    validateText,       // Validación de texto genérico
    validateNumber      // Validación de números
}