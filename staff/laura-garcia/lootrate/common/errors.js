class FormatError extends Error {
    constructor(message) {
        super(message)
        this.name = 'FormatError'
    }
}

class ExistenceError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ExistenceError'
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = 'NotFoundError'
    }
}

class CredentialsError extends Error {
    constructor(message) {
        super(message)
        this.name = 'CredentialsError'
    }
}

class AuthError extends Error {
    constructor(message) {
        super(message)
        this.name = 'AuthError'
    }
}

class DuplicityError extends Error {
    constructor(message) {
        super(message)
        this.name = 'DuplicityError'
    }
}

class ContentError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ContentError'
    }
}


class TokenError extends Error {
    constructor(message) {
        super(message)
        this.name = 'TokenError'
    }
}

class ServerError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ServerError'
    }
}

class ConnectionError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ConnectionError'
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ValidationError'
    }
}

export {
    FormatError,       
    ExistenceError,    
    NotFoundError,    
    CredentialsError,   
    AuthError,         
    DuplicityError,    
    ContentError,   
    TokenError,        
    ServerError,        
    ConnectionError,    
    ValidationError    
}