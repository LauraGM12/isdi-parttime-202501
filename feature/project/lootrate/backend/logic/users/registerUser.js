// logic/auth/registerUser.js - Lógica para registrar un nuevo usuario

import { User } from '../../data/models.js';

/**
 * Registra un nuevo usuario en la base de datos
 * @param {string} username - Nombre de usuario único
 * @param {string} email - Email único del usuario
 * @param {string} password - Contraseña (se hasheará automáticamente)
 * @returns {Object} Usuario creado (sin contraseña)
 * @throws {Error} Si hay errores de validación o duplicados
 */
const registerUser = async (username, email, password) => {
  // Validación básica de parámetros
  if (!username || !email || !password) {
    throw new Error('Todos los campos son obligatorios');
  }

  try {
    // Verificar si ya existe un usuario con ese username o email
    const existingUser = await User.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new Error('El nombre de usuario ya está en uso');
      }
      if (existingUser.email === email) {
        throw new Error('El email ya está registrado');
      }
    }

    // Crear el nuevo usuario (la contraseña se hashea automáticamente)
    const newUser = new User({
      username,
      email,
      password
    });

    // Guardar en la base de datos
    const savedUser = await newUser.save();

    // Retornar el usuario sin la contraseña (toJSON lo hace automáticamente)
    return savedUser.toJSON();

  } catch (error) {
    // Si es un error de validación de Mongoose, extraer el mensaje
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new Error(messages.join(', '));
    }
    
    // Si es un error de duplicado de MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      throw new Error(`El ${field} ya está en uso`);
    }

    // Re-lanzar cualquier otro error
    throw error;
  }
};

export default registerUser;