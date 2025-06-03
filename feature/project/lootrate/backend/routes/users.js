import express from 'express';
import registerUser from '../logic/users/registerUser.js';

const router = express.Router();

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validación básica
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    // Llamar a la lógica de registro
    const newUser = await registerUser(username, email, password);
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: newUser
    });
    
  } catch (error) {
    console.error('Error en registro:', error.message);
    
    // Manejar errores específicos
    if (error.message.includes('ya está en uso') || error.message.includes('ya está registrado')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.code === 11000) { // Error de duplicado de MongoDB
      return res.status(409).json({
        success: false,
        message: 'El usuario o email ya existe'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;