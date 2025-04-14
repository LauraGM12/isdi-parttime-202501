import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
    return <div className="home">
        <section className="home__welcome">
            <h1 className="home__title">Bienvenido a FrikiPosts</h1>
            <p className="home__description">Tu espacio para compartir momentos especiales y conectar con otros usuarios</p>
        </section>

        <section className="home__features">
            <h2 className="home__subtitle">Descubre todo lo que puedes hacer</h2>
            
            <div className="home__cards">
                <div className="home__card">
                    <i className="bi bi-pencil-square home__card-icon"></i>
                    <h3 className="home__card-title">Comparte tus Posts</h3>
                    <p className="home__card-description">Crea y comparte tus momentos favoritos</p>
                    <Link to="/my-posts" className="home__card-link">Ver mis posts</Link>
                </div>

                <div className="home__card">
                    <i className="bi bi-people-fill home__card-icon"></i>
                    <h3 className="home__card-title">Explora la Comunidad</h3>
                    <p className="home__card-description">Descubre publicaciones de otros usuarios</p>
                    <Link to="/posts" className="home__card-link">Ver todos los posts</Link>
                </div>

                <div className="home__card">
                    <i className="bi bi-person-circle home__card-icon"></i>
                    <h3 className="home__card-title">Tu Perfil</h3>
                    <p className="home__card-description">Personaliza tu perfil y gestiona tu contenido</p>
                    <Link to="/my-profile" className="home__card-link">Ir a mi perfil</Link>
                </div>
            </div>
        </section>
    </div>
}

export default Home