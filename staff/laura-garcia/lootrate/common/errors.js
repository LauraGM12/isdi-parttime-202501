/**
 * Error de formato de datos
 * 
 * Se lanza cuando los datos proporcionados no cumplen con el formato esperado,
 * como emails mal formateados, contraseñas que no cumplen criterios, etc.
 * 
 * @extends Error
 */
class FormatError extends Error {
    constructor(message) {
        super(message)
        this.name = 'FormatError'
    }
}

/**
 * Error de existencia (recurso no encontrado)
 * 
 * Se lanza cuando se intenta acceder a un recurso que no existe en la base de datos,
 * como un usuario, juego o cualquier entidad que no se puede encontrar.
 * 
 * @extends Error
 */
class ExistenceError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ExistenceError'
    }
}

/**
 * Alias para compatibilidad - Error de recurso no encontrado
 * 
 * Proporciona compatibilidad con código que utiliza NotFoundError
 * en lugar de ExistenceError. Ambos representan el mismo tipo de error.
 * 
 * @extends Error
 */
class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = 'NotFoundError'
    }
}

/**
 * Error de credenciales
 * 
 * Se lanza cuando las credenciales proporcionadas (email/contraseña)
 * no son válidas o no coinciden con las almacenadas en el sistema.
 * 
 * @extends Error
 */
class CredentialsError extends Error {
    constructor(message) {
        super(message)
        this.name = 'CredentialsError'
    }
}

/**
 * Error de autenticación
 * 
 * Se lanza cuando hay problemas con la autenticación del usuario,
 * como tokens JWT inválidos, sesiones expiradas, etc.
 * 
 * @extends Error
 */
class AuthError extends Error {
    constructor(message) {
        super(message)
        this.name = 'AuthError'
    }
}

/**
 * Error de duplicidad (recurso ya existe)
 * 
 * Se lanza cuando se intenta crear un recurso que ya existe,
 * como registrar un usuario con un email que ya está en uso.
 * 
 * @extends Error
 */
class DuplicityError extends Error {
    constructor(message) {
        super(message)
        this.name = 'DuplicityError'
    }
}

/**
 * Error de contenido
 * 
 * Se lanza cuando el contenido proporcionado no es apropiado
 * o no cumple con las políticas de la aplicación.
 * 
 * @extends Error
 */
class ContentError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ContentError'
    }
}

/**
 * Error de token JWT
 * 
 * Se lanza cuando hay problemas específicos con tokens JWT,
 * como tokens malformados, expirados o con firma inválida.
 * 
 * @extends Error
 */
class TokenError extends Error {
    constructor(message) {
        super(message)
        this.name = 'TokenError'
    }
}

/**
 * Error del servidor
 * 
 * Se lanza cuando ocurren errores internos del servidor,
 * como problemas de base de datos, servicios externos, etc.
 * 
 * @extends Error
 */
class ServerError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ServerError'
    }
}

/**
 * Error de conexión
 * 
 * Se lanza cuando hay problemas de conectividad con servicios externos,
 * base de datos, APIs, etc.
 * 
 * @extends Error
 */
class ConnectionError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ConnectionError'
    }
}

/**
 * Error de validación
 * 
 * Se lanza cuando los datos no pasan las validaciones de negocio,
 * diferentes a los errores de formato básico.
 * 
 * @extends Error
 */
class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ValidationError'
    }
}

// Exportar todas las clases de error para uso en toda la aplicación
export {
    FormatError,        // Errores de formato de datos
    ExistenceError,     // Recursos no encontrados
    NotFoundError,      // Alias de ExistenceError
    CredentialsError,   // Credenciales inválidas
    AuthError,          // Errores de autenticación
    DuplicityError,     // Recursos duplicados
    ContentError,       // Contenido inapropiado
    TokenError,         // Errores de JWT
    ServerError,        // Errores internos del servidor
    ConnectionError,    // Errores de conectividad
    ValidationError     // Errores de validación de negocio
}