import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import locales from '../../locales'
import './Home.css'

const Home = ({ locale }) => {
    const [translations, setTranslations] = useState(locales[locale]['home'])

    useEffect(() => {
        setTranslations(locales[locale]['home'])
    }, [locale])

    return <div className="home">
        <section className="home__welcome">
            <h1 className="home__title">{translations.welcome}</h1>
            <p className="home__description">{translations.description}</p>
        </section>

        <section className="home__features">
            <h2 className="home__subtitle">{translations.discover}</h2>
            
            <div className="home__cards">
                <div className="home__card">
                    <i className="bi bi-pencil-square home__card-icon"></i>
                    <h3 className="home__card-title">{translations.posts.title}</h3>
                    <p className="home__card-description">{translations.posts.description}</p>
                    <Link to="/my-posts" className="home__card-link">{translations.posts.link}</Link>
                </div>

                <div className="home__card">
                    <i className="bi bi-people-fill home__card-icon"></i>
                    <h3 className="home__card-title">{translations.community.title}</h3>
                    <p className="home__card-description">{translations.community.description}</p>
                    <Link to="/posts" className="home__card-link">{translations.community.link}</Link>
                </div>

                <div className="home__card">
                    <i className="bi bi-person-circle home__card-icon"></i>
                    <h3 className="home__card-title">{translations.profile.title}</h3>
                    <p className="home__card-description">{translations.profile.description}</p>
                    <Link to="/my-profile" className="home__card-link">{translations.profile.link}</Link>
                </div>
            </div>
        </section>
    </div>
}

export default Home