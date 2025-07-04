import dotenv from 'dotenv'

// Cargar variables de entorno desde .env
dotenv.config()

// Configuración global para tests
// Asegurar que las variables de entorno estén disponibles para tests
process.env.RAWG_API_KEY = process.env.RAWG_API_KEY || 'test-api-key'
process.env.RAWG_BASE_URL = process.env.RAWG_BASE_URL || 'https://api.rawg.io/api/'
process.env.RAWG_API_KEY = process.env.RAWG_API_KEY || '1d35f0064f6946c199bd8ffe4cfb2d26'