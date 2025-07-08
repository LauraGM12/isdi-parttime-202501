import { data } from '../../../data/index.js'
import { errors, validator } from 'common'

const { NotFoundError, AuthorizationError } = errors
const { reviews: Review, ObjectId } = data  

const addComment = async (req, res, next) => {
    try {
        const { reviewId } = req.params
        const { content } = req.body
        const userId = req.userId

        validator.validateId(reviewId, 'reviewId')
        validator.validateText(content, 'content', 1, 500)

        let reviewObjectId;
        try {
            reviewObjectId = new ObjectId(reviewId);
        } catch (error) {
            throw new errors.FormatError('El formato del reviewId es inválido');
        }

        const review = await Review.findById(reviewObjectId)
        if (!review) {
            throw new NotFoundError('Reseña no encontrada')
        }

        const newComment = {
            author: userId,
            content,
            createdAt: new Date()
        }

        review.comments.push(newComment)
        await review.save()
        await review.populate('comments.author', 'username avatar')

        const addedComment = review.comments[review.comments.length - 1]
        const commentObj = addedComment.toObject()
        commentObj.id = commentObj._id
        
        res.status(201).json(commentObj)
    } catch (error) {
        next(error)
    }
}

const getComments = async (req, res, next) => {
    try {
        const { reviewId } = req.params

        validator.validateId(reviewId, 'reviewId')

        let reviewObjectId;
        try {
            reviewObjectId = new ObjectId(reviewId);
        } catch (error) {
            throw new errors.FormatError('El formato del reviewId es inválido');
        }

        const review = await Review.findById(reviewObjectId)
            .select('comments')
            .populate('comments.author', 'username avatar')

        if (!review) {
            throw new NotFoundError('Reseña no encontrada')
        }
        const comments = review.comments.map(comment => {
            const commentObj = comment.toObject()
            commentObj.id = commentObj._id
            return commentObj
        })

        res.json(comments)
    } catch (error) {
        next(error)
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const { reviewId, commentId } = req.params
        const userId = req.userId

        validator.validateId(reviewId, 'reviewId')
        validator.validateId(commentId, 'commentId')

        let reviewObjectId;
        try {
            reviewObjectId = new ObjectId(reviewId);
        } catch (error) {
            throw new errors.FormatError('El formato del reviewId es inválido');
        }

        const review = await Review.findById(reviewObjectId)
        if (!review) {
            throw new NotFoundError('Reseña no encontrada')
        }

        const comment = review.comments.id(commentId)
        if (!comment) {
            throw new NotFoundError('Comentario no encontrado')
        }

        if (comment.author.toString() !== userId && review.author.toString() !== userId) {
            throw new AuthorizationError('No tienes permiso para eliminar este comentario')
        }

        review.comments.pull({ _id: commentId })
        await review.save()

        res.json({ message: 'Comentario eliminado correctamente' })
    } catch (error) {
        next(error)
    }
}

export {
    addComment,
    getComments,
    deleteComment
}