import * as users from './users/index.js'
import { getHomeData, getGamesByGenre } from "./games/getHomeData.js"
import { searchGames } from "./games/searchGames.js"
import * as reviewsLogic from "./reviews/index.js"

export const games = {
    getHomeData,
    getGamesByGenre,
    searchGames
}

export const reviews = reviewsLogic

export { users }