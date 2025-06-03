import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { data } from './data/index.js';
import usersRouter from './routes/users.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
data.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', 'lootrate')
  .then(() => console.log('Servidor listo'))
  .catch(error => {
    console.error('Error conectando a la BD:', error);
    process.exit(1);
  });

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API LootRate funcionando', status: 'OK' });
});

// Usar las rutas de usuarios
app.use('/api/users', usersRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});