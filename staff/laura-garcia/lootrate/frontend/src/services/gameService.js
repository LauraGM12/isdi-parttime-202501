import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Obtiene detalles completos de un juego
 * @param {string} gameId - ID del juego
 * @returns {Promise<Object>} - Datos del juego
 */
export const getGameDetails = async (gameId) => {
  try {
    const response = await axios.get(`${API_URL}/games/${gameId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw error;
  }
};

/**
 * Obtiene tiendas donde comprar un juego
 * @param {string} gameId - ID del juego
 * @returns {Promise<Array>} - Lista de tiendas
 */
export const getGameStores = async (gameId) => {
  try {
    const response = await axios.get(`${API_URL}/games/${gameId}/stores`);
    return response.data;
  } catch (error) {
    console.error('Error fetching game stores:', error);
    throw error;
  }
};