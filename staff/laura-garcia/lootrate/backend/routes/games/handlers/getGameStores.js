import { getGameStores } from '../../../logic/games/rawgService.js'

const getGameStoresHandler = async (req, res) => {
  try {
    const { gameId } = req.params;
    
    if (!gameId) {
      return res.status(400).json({ error: 'Se requiere el ID del juego' });
    }
    
    const stores = await getGameStores(gameId);
    
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tiendas del juego' });
  }
};

export default getGameStoresHandler;