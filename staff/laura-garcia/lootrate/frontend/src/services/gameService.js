import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getGameDetails = async (gameId) => {
  try {
    const response = await axios.get(`${API_URL}/games/${gameId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGameStores = async (gameId) => {
  try {
    const response = await axios.get(`${API_URL}/games/${gameId}/stores`);
    return response.data;
  } catch (error) {
    throw error;
  }
};