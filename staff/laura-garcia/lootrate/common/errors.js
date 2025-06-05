// Clases de errores personalizados para la aplicación

// Error de formato de datos
class FormatError extends Error {
    constructor(message) {
        super(message)
        this.name = 'FormatError'
    }
}

// Error de existencia (recurso no encontrado)
class ExistenceError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ExistenceError'
    }
}

// Error de autenticación
class AuthError extends Error {
    constructor(message) {
        super(message)
        this.name = 'AuthError'
    }
}

// Error de duplicidad (recurso ya existe)
class DuplicityError extends Error {
    constructor(message) {
        super(message)
        this.name = 'DuplicityError'
    }
}

// Error de contenido
class ContentError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ContentError'
    }
}

// Error de token JWT
class TokenError extends Error {
    constructor(message) {
        super(message)
        this.name = 'TokenError'
    }
}

// Error del servidor
class ServerError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ServerError'
    }
}

export {
    FormatError,
    ExistenceError,
    AuthError,
    DuplicityError,
    ContentError,
    TokenError,
    ServerError
}