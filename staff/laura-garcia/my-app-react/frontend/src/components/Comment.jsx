import { useState } from 'react'
import { Link } from 'react-router-dom'
import Btn from './lib/Btn'
import './Comment.css'

const Comment = ({ comment, postId, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(comment.text)

    const handleUpdate = () => {
        onUpdate(postId, comment.id, editText)
        setIsEditing(false)
    }

    return (
        <div className="comment">
            <div className="comment__header">
                <img 
                    src={comment.author.avatar || 'default-avatar.png'} 
                    alt={comment.author.username} 
                    className="comment__avatar"
                />
                <Link to={`/profile/${comment.author.username}`} className="comment__username">
                    {comment.author.username}
                </Link>
                <span className="comment__date">
                    {new Date(comment.date).toLocaleDateString()}
                    {comment.edited && ' (editado)'}
                </span>
            </div>

            <div className="comment__content">
                {isEditing ? (
                    <div className="comment__edit">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="comment__edit-input"
                        />
                        <div className="comment__edit-buttons">
                            <Btn 
                                btnClassnames="comment__btn comment__btn--save"
                                btnContent="Guardar"
                                btnCallback={handleUpdate}
                            />
                            <Btn 
                                btnClassnames="comment__btn comment__btn--cancel"
                                btnContent="Cancelar"
                                btnCallback={() => setIsEditing(false)}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="comment__text">{comment.text}</p>
                        <div className="comment__actions">
                            <Btn 
                                btnClassnames="comment__btn"
                                btnContent={<i className="bi bi-pencil-fill"></i>}
                                btnCallback={() => setIsEditing(true)}
                            />
                            <Btn 
                                btnClassnames="comment__btn"
                                btnContent={<i className="bi bi-trash-fill"></i>}
                                btnCallback={() => onDelete(postId, comment.id)}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Comment