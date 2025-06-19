import mongoose from 'mongoose'

const { Schema, model } = mongoose
const { ObjectId } = Schema.Types

// Esquema para el modelo de Usuario
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // PERFIL BÁSICO
    avatar: {
        type: String,
        required: false,
        default: null
    },
    bio: {
        type: String,
        required: false,
        maxlength: 500
    },
    firstName: {
        type: String,
        required: false,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: false,
        maxlength: 50
    },
    // PREFERENCIAS DE JUEGOS
    favoriteGenres: [{
        type: String,
        enum: ['adventure', 'fps', 'rpg', 'strategy', 'sports', 'racing', 'puzzle', 'simulation', 'action', 'horror', 'indie']
    }],
    favoritePlatforms: [{
        type: String,
        enum: ['pc', 'playstation', 'xbox', 'nintendo-switch', 'mobile']
    }],
    dateOfBirth: {
        type: Date,
        required: false
    },
    location: {
        type: String,
        required: false,
        maxlength: 100
    },
    // LISTAS DE JUEGOS
    wishlist: [{
        gameId: { type: String, required: true },
        gameName: { type: String, required: true },
        gameImage: { type: String },
        addedAt: { type: Date, default: Date.now }
    }],
    currentlyPlaying: [{
        gameId: { type: String, required: true },
        gameName: { type: String, required: true },
        gameImage: { type: String },
        startedAt: { type: Date, default: Date.now },
        hoursPlayed: { type: Number, default: 0 }
    }],
    completedGames: [{
        gameId: { type: String, required: true },
        gameName: { type: String, required: true },
        gameImage: { type: String },
        completedAt: { type: Date, default: Date.now },
        rating: { type: Number, min: 1, max: 10 }
    }],
    // CONFIGURACIÓN DE PRIVACIDAD
    privacy: {
        profileVisibility: {
            type: String,
            enum: ['public', 'friends', 'private'],
            default: 'public'
        },
        showEmail: {
            type: Boolean,
            default: false
        },
        showRealName: {
            type: Boolean,
            default: false
        },
        showGameLists: {
            type: Boolean,
            default: true
        }
    },
    // SOCIAL
    followers: [{
        type: ObjectId,
        ref: 'User'
    }],
    following: [{
        type: ObjectId,
        ref: 'User'
    }],
    // ESTADÍSTICAS
    stats: {
        totalReviews: {
            type: Number,
            default: 0
        },
        totalGamesPlayed: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }
}, {
    timestamps: true // Añadir createdAt y updatedAt automáticamente
})

// Esquema para el modelo de Juego
const gameSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    platform: [{
        type: String,
        enum: ['pc', 'playstation', 'xbox', 'nintendo-switch', 'mobile'],
        required: true
    }],
    scoreApi: {
        type: Number,
        min: 0,
        max: 100,
        required: false // Puntuación de APIs externas (Metacritic, etc.)
    },
    scoreByUsers: [{
        user: {
            type: ObjectId,
            ref: 'User',
            required: true
        },
        score: {
            type: Number,
            min: 0,
            max: 10,
            required: true
        }
    }],
    genre: [{
        type: String,
        enum: ['adventure', 'fps', 'rpg', 'strategy', 'sports', 'racing', 'puzzle', 'simulation', 'action', 'horror', 'indie'],
        required: true
    }],
    description: {
        type: String,
        required: false
    },
    releaseDate: {
        type: Date,
        required: false
    },
    developer: {
        type: String,
        required: false
    },
    publisher: {
        type: String,
        required: false
    },
    coverImage: {
        type: String,
        required: false
    }
}, {
    timestamps: true
})

// Esquema para el modelo de Reseña
const reviewSchema = new Schema({
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        minlength: 10, 
        maxlength: 2000 
    },
    game: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
        required: true // Puntuación numérica del usuario
    },
    likes: [{
        type: ObjectId,
        ref: 'User'
    }],
    helpful: [{
        type: ObjectId,
        ref: 'User' // Usuarios que marcaron la reseña como útil
    }]
}, {
    timestamps: true
})

// Índices para mejorar el rendimiento
gameSchema.index({ name: 1 })
gameSchema.index({ genre: 1 })
gameSchema.index({ platform: 1 })
reviewSchema.index({ game: 1, author: 1 }, { unique: true }) // Un usuario solo puede reseñar un juego una vez
reviewSchema.index({ game: 1 })
reviewSchema.index({ author: 1 })

// Métodos virtuales para calcular puntuación promedio
gameSchema.virtual('averageUserScore').get(function() {
    if (this.scoreByUsers.length === 0) return 0
    const total = this.scoreByUsers.reduce((sum, score) => sum + score.score, 0)
    return (total / this.scoreByUsers.length).toFixed(1)
})

// Exportar los modelos
export const User = model('User', userSchema)
export const Game = model('Game', gameSchema)
export const Review = model('Review', reviewSchema)