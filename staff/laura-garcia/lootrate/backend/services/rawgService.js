import axios from 'axios';

const API_URL = 'https://api.rawg.io/api';
const API_KEY = process.env.RAWG_API_KEY;

export const getGameDetails = async (gameId) => {
  try {
    const response = await axios.get(`${API_URL}/games/${gameId}?key=${API_KEY}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching game details');
  }
};

export const getGameStores = async (gameId) => {
  try {
    const response = await axios.get(`${API_URL}/games/${gameId}/stores?key=${API_KEY}`);
    return response.data.results;
  } catch (error) {
    throw new Error('Error fetching game stores');
  }
};

export const getGameScreenshots = async (gameId) => {
  try {
    const response = await axios.get(`${API_URL}/games/${gameId}/screenshots?key=${API_KEY}`);
    return response.data.results;
  } catch (error) {
    throw new Error('Error fetching game screenshots');
  }
};