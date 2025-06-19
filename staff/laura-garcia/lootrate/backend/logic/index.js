import * as users from './users/index.js'
import { getHomeData, getGamesByGenre } from "./games/getHomeData.js"
import { searchGames } from "./games/searchGames.js"

export const games = {
    getHomeData,
    getGamesByGenre,
    searchGames
}

export { users }