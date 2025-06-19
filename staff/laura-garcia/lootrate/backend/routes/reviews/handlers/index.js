import {
    createReviewHandler,
    getGameReviewsHandler,
    getUserReviewsHandler,
    getOwnReviewsHandler,
    updateReviewHandler,
    deleteReviewHandler,
    toggleLikeHandler,
    toggleHelpfulHandler
} from './reviewHandlers.js'

export default {
    createReview: createReviewHandler,
    getGameReviews: getGameReviewsHandler,
    getUserReviews: getUserReviewsHandler,
    getOwnReviews: getOwnReviewsHandler,
    updateReview: updateReviewHandler,
    deleteReview: deleteReviewHandler,
    toggleLike: toggleLikeHandler,
    toggleHelpful: toggleHelpfulHandler
}