import {
    createReviewHandler,
    getGameReviewsHandler,
    getUserReviewsHandler,
    getOwnReviewsHandler,
    updateReviewHandler,
    deleteReviewHandler,
    toggleLikeHandler,
    toggleHelpfulHandler,
    addCommentHandler,
    getCommentsHandler,
    deleteCommentHandler
} from './reviewHandlers.js'

export default {
    createReview: createReviewHandler,
    getGameReviews: getGameReviewsHandler,
    getUserReviews: getUserReviewsHandler,
    getOwnReviews: getOwnReviewsHandler,
    updateReview: updateReviewHandler,
    deleteReview: deleteReviewHandler,
    toggleLike: toggleLikeHandler,
    toggleHelpful: toggleHelpfulHandler,
    addComment: addCommentHandler,
    getComments: getCommentsHandler,
    deleteComment: deleteCommentHandler
}