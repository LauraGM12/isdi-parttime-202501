const useState = React.useState //Nos traemos el hook useState de react
const useEffect = React.useEffect //Nos traemos el hook useEffect de react

const App = () => {
    const [showWordForm, setShowWordForm] = useState(true)
    const [showNumberForm, setShowNumberForm] = useState(true)
    /*PASO 6: añade aquí el estado de words, usando useState*/
    const [words, setWords] = useState([])
    const [numbers, setNumbers] = useState([])
    /*PASO 7: añade un estado llamado timeStamp cuyo valor por defecto sea Date.now()*/
    const [timeStamp, setTimeStamp] = useState(Date.now())
    /*PASO 6: añade aquí tu useEffect*/
    /*PASO 7: añade el timeStamp al array de dependencias del useEffect*/
    
    useEffect(() => {
        const retrievedWords = data.words.getAll();
        setWords(retrievedWords);
    }, [timeStamp]) 

    useEffect(() => {
        const retrievedNumbers = data.numbers.getAll();
        setNumbers(retrievedNumbers);
    }, [timeStamp]) 
    

    const handleNavClickWords = () => {
        setShowWordForm(!showWordForm)
        setTimeStamp(Date.now())
    }

    const handleNavClickNumbers = () => {
        setShowNumberForm(!showNumberForm)
        setTimeStamp(Date.now())
    }

    const handleSendNewWord = (newWordFormData) => {
        data.words.addNew(newWordFormData.word)
        setShowWordForm(false)
        setTimeStamp(Date.now())
    }

    const handleSendNewNumber = (newNumbersFormData) => {
          data.numbers.addNew(newNumbersFormData.number)
          setShowNumberForm(false)
          setTimeStamp(Date.now())
      }

    const handleDeleteWord = (wordIndex) => {
        data.words.deleteByIndex(wordIndex)
        setTimeStamp(Date.now())
    }

    const handleDeleteNumber = (numberIndex) => {
        data.numbers.deleteByIndex(numberIndex)
        setTimeStamp(Date.now())
    }

    return (
        <div className="main-container">
            <Btn
                className={'navigation-button'}
                btnCallback={handleNavClickWords} 
                btnContent={showWordForm ? 'Ir a lista de palabras' : 'Añadir más palabras'}
            />
            {showWordForm ? (
                <Form
                    inputs={[{ type: "text", placeholder: "Nueva palabra", id: "word", className: "input-text" }   
                    ]}
                    onSubmitCallback={handleSendNewWord}
                    submitText="Guardar Palabra"
                    className="form"
                />
            ) : (
                <List 
                items={words} 
                onItemClick={handleDeleteWord} />
            )}
            <Btn
                className={'navigation-button'}
                btnCallback={handleNavClickNumbers} 
                btnContent={showNumberForm ? 'Ir a lista de números' : 'Añadir más números'}
            />
            {showNumberForm ? (
                <Form
                    inputs={[{ type: "number", placeholder: "Nuevo número", id: "number", className: "input-number" }  
                    ]}
                    onSubmitCallback={handleSendNewNumber}
                    submitText="Guardar Número"
                    className="form"
                />
            ) : (
                <List 
                items={numbers} 
                onItemClick={handleDeleteNumber} />
            )}
        </div>
    );
};