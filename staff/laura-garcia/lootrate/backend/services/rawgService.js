import axios from 'axios';

const API_URL = 'https://api.rawg.io/api';
const API_KEY = process.env.RAWG_API_KEY;

/**
 * Obtiene detalles completos de un juego por su ID
 * @param {string} gameId - ID del juego en RAWG
 * @returns {Promise<Object>} - Datos completos del juego
 */
export const getGameDetails = async (gameId) => {
  try {
    const response = await axios.get(`${API_URL}/games/${gameId}?key=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw new Error('Error fetching game details');
  }
};

/**
 * Obtiene las tiendas donde se puede comprar un juego
 * @param {string} gameId - ID del juego en RAWG
 * @returns {Promise<Array>} - Lista de tiendas
 */
export const getGameStores = async (gameId) => {
  try {
    const response = await axios.get(`${API_URL}/games/${gameId}/stores?key=${API_KEY}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching game stores:', error);
    throw new Error('Error fetching game stores');
  }
};

/**
 * Obtiene capturas de pantalla de un juego
 * @param {string} gameId - ID del juego en RAWG
 * @returns {Promise<Array>} - Lista de capturas de pantalla
 */
export const getGameScreenshots = async (gameId) => {
  try {
    const response = await axios.get(`${API_URL}/games/${gameId}/screenshots?key=${API_KEY}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching game screenshots:', error);
    throw new Error('Error fetching game screenshots');
  }
};