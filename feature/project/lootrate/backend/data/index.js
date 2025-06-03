import mongoose from 'mongoose';
import { User } from './models.js';

export const data = {
  users: User,
  connect: async (url, dbName) => {
    try {
      await mongoose.connect(`${url}/${dbName}`);
      console.log(`Conectado a MongoDB: ${url}/${dbName}`);
    } catch (error) {
      console.error('Error conectando a MongoDB:', error.message);
      throw error;
    }
  },
  disconnect: async () => {
    try {
      await mongoose.disconnect();
      console.log('Desconectado de MongoDB');
    } catch (error) {
      console.error('Error desconectando:', error.message);
      throw error;
    }
  }
};