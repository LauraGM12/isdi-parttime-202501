import './NotFound.css'

const NotFound = () => {
    return (
        <div className="not-found">
            <div className="not-found__content">
                <div className="not-found__image">
                    <svg viewBox="0 0 500 200" className="not-found__svg">
                        <path d="M50,100 Q100,50 150,100 T250,100 T350,100 T450,100" 
                              className="not-found__path" />
                        <text x="50%" y="50%" textAnchor="middle" className="not-found__text-404">
                            404
                        </text>
                        <text x="50%" y="70%" textAnchor="middle" className="not-found__text-flower">
                            ✿
                        </text>
                    </svg>
                </div>
                <h1 className="not-found__title">¡Ups! Página no encontrada</h1>
                <p className="not-found__text">La página que buscas no existe o ha sido movida</p>
                <a href="/" className="not-found__button">Volver al inicio</a>
            </div>
        </div>
    )
}

export default NotFound