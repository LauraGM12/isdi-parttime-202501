import { useState } from 'react'

const SearchBar = ({ onSearch, placeholder = "Buscar juegos" }) => {
    const [searchValue, setSearchValue] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        if (searchValue.trim()) {
            onSearch(searchValue.trim())
        }
    }

    const handleChange = (event) => {
        setSearchValue(event.target.value)
    }

    return (
        <div className="mb-8">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={searchValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full bg-gray-800 text-white px-4 py-3 pr-12 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
                
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors duration-200"
                    title="Buscar"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>
        </div>
    )
}

export default SearchBar