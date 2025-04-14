import './Logo.css'

const Logo = ({ size, onClick }) => {
    return (
        <svg
            onClick={onClick}
            className={`logo ${size}`}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Fondo del logo */}
            <rect width="100%" height="100%" fill="#A7C7E7" rx="15" />

            {/* Carita Pixel Art (Gatito Cute) */}
            <rect x="60" y="50" width="80" height="80" fill="#FFB6C1" rx="10" />
            <rect x="75" y="70" width="10" height="10" fill="#000" />
            <rect x="115" y="70" width="10" height="10" fill="#000" />
            <rect x="90" y="95" width="20" height="5" fill="#000" />
            
            {/* Texto Pixelado */}
            <text 
                x="50%" 
                y="170" 
                fontFamily="'Press Start 2P', cursive" 
                fontSize="14" 
                fill="#FFFFFF" 
                textAnchor="middle"
            >
                FrikiPixel
            </text>
        </svg>
    )
}

export default Logo