// logic/auth/loginUser.js - Lógica para autenticar un usuario

import { User } from '../../data/models.js';

/**
 * Autentica un usuario y genera un token JWT
 * @param {string} usernameOrEmail - Username o email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Object} Usuario y token JWT
 * @throws {Error} Si las credenciales son incorrectas
 */
const loginUser = async (usernameOrEmail, password) => {
  // Validación básica de parámetros
  if (!usernameOrEmail || !password) {
    throw new Error('Username/email y contraseña son obligatorios');
  }

  try {
    // Buscar usuario por username o email
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    });

    // Si no existe el usuario
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }

    // Verificar la contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Credenciales incorrectas');
    }

    // Generar token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
      userId: user._id.toString(),
      username: user.username 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // Token válido por 7 días
      .sign(secret);

    // Retornar usuario (sin contraseña) y token
    return {
      user: user.toJSON(),
      token
    };

  } catch (error) {
    throw error;
  }
};

export default loginUser;