import mongoose from 'mongoose'

const { Schema, model } = mongoose
const { ObjectId } = Schema.Types

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
    followers: [{
        type: ObjectId,
        ref: 'User'
    }],
    following: [{
        type: ObjectId,
        ref: 'User'
    }],
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
    timestamps: true 
})

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
        required: false 
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
        required: true 
    },
    likes: [{
        type: ObjectId,
        ref: 'User'
    }],
    helpful: [{
        type: ObjectId,
        ref: 'User'
    }],
    comments: [{
        author: {
            type: ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 500
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
})

gameSchema.index({ name: 1 })
gameSchema.index({ genre: 1 })
gameSchema.index({ platform: 1 })
reviewSchema.index({ game: 1, author: 1 }, { unique: true })
reviewSchema.index({ game: 1 })
reviewSchema.index({ author: 1 })

gameSchema.virtual('averageUserScore').get(function() {
    if (this.scoreByUsers.length === 0) return 0
    const total = this.scoreByUsers.reduce((sum, score) => sum + score.score, 0)
    return (total / this.scoreByUsers.length).toFixed(1)
})

export const User = model('User', userSchema)
export const Game = model('Game', gameSchema)
export const Review = model('Review', reviewSchema)