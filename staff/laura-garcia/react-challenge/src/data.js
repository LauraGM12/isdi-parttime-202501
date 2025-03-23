const data = {
    words: {
        getAll: () => {
            const jsonWords = localStorage.words
            return jsonWords ? JSON.parse(jsonWords) : []
        },
        addNew: (word) => {
            const jsonWords = localStorage.words
            const wordsRetrieved = jsonWords ? JSON.parse(jsonWords) : []
            wordsRetrieved.push(word)
            localStorage.words = JSON.stringify(wordsRetrieved)
        },
        deleteByIndex: (index) => {
            const jsonWords = localStorage.words
            const wordsRetrieved = jsonWords ? JSON.parse(jsonWords) : []
            if (wordsRetrieved.length > 0) wordsRetrieved.splice(index, 1)
            localStorage.words = JSON.stringify(wordsRetrieved)
        }
    },
    numbers: {
        getAll: () => {
            const jsonNumbers = localStorage.numbers
            return jsonNumbers ? JSON.parse(jsonNumbers) : []
        },
        addNew: (number) => {
            const jsonNumbers = localStorage.numbers
            const numbersRetrieved = jsonNumbers ? JSON.parse(jsonNumbers) : []
            numbersRetrieved.push(number)
            localStorage.numbers = JSON.stringify(numbersRetrieved)
        },
        deleteByIndex: (index) => {
            const jsonNumbers = localStorage.numbers
            const numbersRetrieved = jsonNumbers ? JSON.parse(jsonNumbers) : []
            if (numbersRetrieved.length > 0) numbersRetrieved.splice(index, 1)
            localStorage.numbers = JSON.stringify(numbersRetrieved)
        }
    }

}