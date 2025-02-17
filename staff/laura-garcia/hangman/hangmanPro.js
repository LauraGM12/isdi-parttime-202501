//Lógica del juego
var words = ['charmander', 'patata', 'javascript', 'pikachu', 'pizza', 'perro']
var word = words[Math.floor(Math.random() * words.length)];
var guessedWordArray = generateGuessedWordArray(word) //almacenara el patrón de la palabra adivinada hasta ahora ([-,-,l,l,-] para hello)
var guessedWord = '' //almacena el patrón pero en un string -----
var lifes = 5;
var playedLetters = [];
var alphabet = 'abcdefghijklmnopqrstuvwxyz'
var alphabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
guessedWordToString(); //completa el guessedWord (string) solo con guiones

function validateInputLetter(letter) {
    if (letter.length !== 1 || letter === ' ' || !isNaN(letter)) { //compruebo que la letra es solo un caracter (o un numero)
        alert('make sure you put a single letter')
        return;
    }

    /*iterar abecedario para comprobar que el caracter es una letra, y pasarlo a minuscula si hace falta*/
    for (var i = 0; i < alphabet.length; i++) {
        if (letter === alphabet[i] || letter === alphabetUpper[i]) { //comparo la misma posición en alfabeto en minusculas y en mayusculas y si hay una coincidencia, me salgo de la función devolviendo la letra en minuscula
            //comprobar si esa letra ya se ha jugado
            for (var j = 0; j < playedLetters.length; j++) { //comprobar si la letra se había jugado antes
                if (playedLetters[j] === alphabet[i]) {
                    alert('you already tried this');
                    return alphabet[i]
                }
            }
            playedLetters[playedLetters.length] = alphabet[i] //pusehamos al array de played letters la letra jugada
            return alphabet[i]
        }
    }
    return;
}

function checkLetterIncluded(letter) { //actualiza guessedWord si la letra esta en word y si no resta una vida
    var isLetterInWord = false //partimos de la idea de que la letra no esta en la palabra a adivinar
    for (var i = 0; i < word.length; i++) { //iteramos la palabra para ver si contiene la letra 
        if (letter === word[i]) {
            isLetterInWord = true //cambiamos la variable que partia de la idea de que la letra no esta, porque sí que esta
            guessedWordArray[i] = letter
        }
    }
    if (isLetterInWord === false) { //en caso de que la letra no este, resta una vida
        lifes--
    } else {
        guessedWordToString() //actualizar el string para asegurarme de poder detectar la victoria
    }
}

function generateGuessedWordArray(_word) { // genera el guessedWordArray por primera vez (con guiones)
    var tempArr = []
    for (var i = 0; i < _word.length; i++) { //esto lo genera de inicio (solo guiones y espacios si hacen falta)
        if (_word[i] === ' ') {
            tempArr[tempArr.length] = ' '
        } else {
            tempArr[tempArr.length] = '-'
        }
    }
    return tempArr;
}

function guessedWordToString() { //función para pasar el array a string
    guessedWord = ''
    for (var i = 0; i < guessedWordArray.length; i++) {
        guessedWord += guessedWordArray[i]
    }
}

function playGame(letter) {
    if (lifes <= 0) {
        alert('you can not play anymore, you are dead')
        return;
    }
    var validatedLetter = validateInputLetter(letter)
    if (validatedLetter !== undefined) {
        checkLetterIncluded(validatedLetter) //guessedWordArray se actualiza si la letra esta dentro
        //limpiamos la interfaz (porque tiene la info de la ronda anterior)
        cleanInterface();
        //renderizamos la interfaz de nuevo, con la info de la ronda actual
        renderInterface();
    }
}

//Resetea todas las variables necesarias para el juego
function resetGame() {
    word = words[Math.floor(Math.random() * words.length)];
    guessedWordArray = generateGuessedWordArray(word);
    guessedWordToString();
    lifes = 5;
    playedLetters = [];
}

//Empezamos a manejar el renderizado a html
var body = document.body; //---> nos traemos el body
var wordContainer;
var lifesContainer;
var letterFormContainer;
var playAgainButton;
var userFeedbackContainer;
var playedLettersContainer;

//Estilos del body
body.style.display = 'flex';
body.style.flexDirection = 'column';
body.style.alignItems = 'center'
body.style.gap = '2rem';

//Creamos el titulo y le damos estilos
var gameTitle = document.createElement('h1');
gameTitle.textContent = 'THE HANGMAN GAME';
gameTitle.style.textAlign = 'center';

//Añadimos el titulo al body
body.appendChild(gameTitle);

//Añadir al DOM el formulario que permite jugar una letra
function renderLetterForm() {
    //Creamos el formulario para la letra
    letterFormContainer = document.createElement('form');
    //estilizamos el form
    letterFormContainer.style.display = 'flex';
    letterFormContainer.style.flexDirection = 'row';
    letterFormContainer.style.width = '100%';
    letterFormContainer.style.gap = '0.5rem';
    letterFormContainer.style.justifyContent = 'center';

    var letterInput = document.createElement('input');
    letterInput.type = 'text';
    letterInput.minLength = 1;
    letterInput.maxLength = 1;
    letterInput.required = true;
    letterInput.id = 'letter';
    letterInput.style.width = '2rem'

    var submitButton = document.createElement('input');
    submitButton.type = 'submit';

    letterFormContainer.appendChild(letterInput);
    letterFormContainer.appendChild(submitButton);

    //Añadimos el form al body
    body.appendChild(letterFormContainer)
}

function renderPlayAgainButton() {
    playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    playAgainButton.style.width = '7rem';

    body.appendChild(playAgainButton);
    playAgainButton.addEventListener('click', function (event) {
        event.preventDefault();
        resetGame();
        alert('reseting game')
        cleanInterface();
        renderInterface();
    })
}

function renderWordContainer() {
    //Creamos el contenedor para las letras (o cuadrados vacios) de la palabra a adivinar
    wordContainer = document.createElement('div');
    //Damos estilos
    wordContainer.style.width = '100%';
    wordContainer.style.display = 'flex';
    wordContainer.style.flexDirection = 'row';
    wordContainer.style.gap = '0.5rem';
    wordContainer.style.justifyContent = 'center';

    //Creamos cada cuadradito para espacio vacio sin adivinar ['-', 'a', '-']
    for (var i = 0; i < guessedWordArray.length; i++) {
        var letterSquare = document.createElement('div');
        //le damos estilos
        letterSquare.style.height = "2rem";
        letterSquare.style.width = "2rem";
        letterSquare.style.border = "2px dashed slategray"
        letterSquare.style.display = "flex";
        letterSquare.style.justifyContent = "center"
        letterSquare.style.alignItems = "center"
        if (guessedWordArray[i] !== '-') {
            var letterContainer = document.createElement('b');
            letterContainer.textContent = guessedWordArray[i].toUpperCase();
            letterSquare.style.border = "2px solid green"
            letterSquare.style.backgroundColor = "limegreen"
            letterSquare.appendChild(letterContainer)
        }

        //lo añadimos al contenedor
        wordContainer.appendChild(letterSquare)
    }
    //Añadimos los contenedores al body
    body.appendChild(wordContainer)
}

function renderLifesContainer() {
    //Creamos un contenedor para los iconos que representan vidas
    lifesContainer = document.createElement('div');
    //Añadir estilos
    lifesContainer.style.width = '100%';
    lifesContainer.style.display = 'flex';
    lifesContainer.style.flexDirection = 'row';
    lifesContainer.style.gap = '1rem';
    lifesContainer.style.justifyContent = 'center';

    //Creamos un iconito para cada vida que queda
    /* Añadir icono de google icons
        <span class="material-symbols-outlined">
            favorite
        </span>
    */
    for (var i = 0; i < 5; i++) {
        if (i < lifes) {
            var lifeIcon = document.createElement('span');
            lifeIcon.textContent = 'favorite'
            lifeIcon.className = 'material-symbols-outlined';
            lifeIcon.style.color = 'red'
            //Lo añadimos al contenedor
            lifesContainer.appendChild(lifeIcon)
        } else {
            var lifeIcon = document.createElement('span');
            lifeIcon.textContent = 'favorite'
            lifeIcon.className = 'material-symbols-outlined';
            lifeIcon.style.color = 'lightgrey'
            //Lo añadimos al contenedor
            lifesContainer.appendChild(lifeIcon)
        }

    }

    //Añadimos los contenedores al body
    body.appendChild(lifesContainer)
}

function renderUserFeedback() {
    if (lifes <= 0) { //mensaje de derrota
        userFeedbackContainer = document.createElement('div')
        var loseMsg = document.createElement('h2');
        loseMsg.textContent = `Oh! You're out of lifes!`;
        loseMsg.style.color = 'red';
        loseMsg.style.textAlign = 'center'
        userFeedbackContainer.appendChild(loseMsg);
    } else { //En caso opuesto: msj victoria
        userFeedbackContainer = document.createElement('div')
        var winMsg = document.createElement('h2');
        winMsg.textContent = `Congratulations! You guessed the world!`;
        winMsg.style.color = 'green';
        winMsg.style.textAlign = 'center'
        userFeedbackContainer.appendChild(winMsg);
    }

    body.appendChild(userFeedbackContainer)
}

function renderPlayedLettersContainer() {
    playedLettersContainer = document.createElement('div');
    playedLettersContainer.style.display = 'flex';
    playedLettersContainer.style.flexDirection = 'column'

    var playedLettersTitle = document.createElement('h2');
    playedLettersTitle.textContent = 'You already tried:';

    playedLettersContainer.appendChild(playedLettersTitle);


    var letterSquaresContainer = document.createElement('div');
    letterSquaresContainer.style.display = 'flex';
    letterSquaresContainer.style.flexWrap = 'wrap';
    letterSquaresContainer.style.gap = '0.5rem';

    for (var i = 0; i < playedLetters.length; i++) {
        var letterContainer = document.createElement('b');
        letterContainer.style.height = "2rem";
        letterContainer.style.width = "2rem";
        letterContainer.style.border = "2px solid slategray"
        letterContainer.style.display = "flex";
        letterContainer.style.justifyContent = "center"
        letterContainer.style.alignItems = "center"
        letterContainer.style.backgroundColor = "lightgray"
        letterContainer.style.textAlign = 'center';
        letterContainer.textContent = playedLetters[i].toUpperCase()
        letterSquaresContainer.appendChild(letterContainer)
    }

    playedLettersContainer.appendChild(letterSquaresContainer)

    body.appendChild(playedLettersContainer)
}


//Genera la interfaz visual del juego
function renderInterface() {
    renderWordContainer();
    renderLifesContainer();


    //En caso de que se haya perdido/ganado: añadir mensaje de derrota/victoria
    if (lifes <= 0 || guessedWord === word) {
        renderUserFeedback();
        renderPlayAgainButton();
    } else { //En caso de que ninguna de las dos anteriores añadiriamos el formulario
        renderLetterForm();
    }

    if (playedLetters.length > 0) renderPlayedLettersContainer();
}

//Limpia y elimnina todo lo relativo a la interfaz del juego
function cleanInterface() {
    body.removeChild(wordContainer);
    body.removeChild(lifesContainer);
    if (letterFormContainer) body.removeChild(letterFormContainer);
    if (playAgainButton) body.removeChild(playAgainButton);
    if (userFeedbackContainer) body.removeChild(userFeedbackContainer);
    if (playedLettersContainer) body.removeChild(playedLettersContainer);
    wordContainer = undefined;
    lifesContainer = undefined;
    letterFormContainer = undefined;
    playAgainButton = undefined;
    userFeedbackContainer = undefined;
    playedLettersContainer = undefined;
}

//TODO añadir mensaje de "ese input no" cuando alguien intente pasar numeros o algo incorrecto


//Renderizamos la interfaz la primera vez que entra el usuario a la pagina
renderInterface()

//función nativa de js que "escucha" la interacción del usuario con la interfaz.
// En este caso detecta cuando alguien pulsa un botón submit. El event es el form donde este ese botón submit,
// por eso podemos traernos "letter", porque tenemos un input con un id "letter"
addEventListener('submit', function (event) {
    event.preventDefault();
    var letterValue = event.target.letter.value;
    playGame(letterValue)
    //event.stopImmediatePropagation() --> sirve para no llamar al mismo tipo de evento varias veces
})

