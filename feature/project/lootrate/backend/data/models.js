// data/User.js - Modelo de Usuario para LootRate usando Mongoose

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Definimos el esquema del usuario
const userSchema = new mongoose.Schema({
  // Campo username: único, requerido, mínimo 3 caracteres
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
    trim: true, // Elimina espacios al inicio y final
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
    maxlength: [20, 'El nombre de usuario no puede tener más de 20 caracteres']
  },
  
  // Campo email: único, requerido, formato válido
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true, // Convierte a minúsculas automáticamente
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email no válido']
  },
  
  // Campo password: requerido, mínimo 6 caracteres (se hasheará)
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  
  // Campo avatar: opcional, URL de imagen
  avatar: {
    type: String,
    default: null
  }
}, {
  // Opciones del esquema
  timestamps: true, // Añade createdAt y updatedAt automáticamente
  versionKey: false // Elimina el campo __v
});


// Creamos y exportamos el modelo
export const User = mongoose.model('User', userSchema);